---
sidebar_position: 2
title: GitOps con ArgoCD
description: Implementación de GitOps para sincronización declarativa de Kubernetes con repositorios Git usando ArgoCD
keywords: [argocd, gitops, kubernetes, ci/cd, deployment, automatización]
tags: [kubernetes, argocd, gitops, ci/cd]
---

# GitOps con ArgoCD

ArgoCD implementa el patrón GitOps para sincronización declarativa de Kubernetes con repositorios Git, proporcionando despliegues automatizados, auditables y reproducibles.

## ¿Por qué ArgoCD?

| Característica | Beneficio |
|---------------|-----------|
| **GitOps Nativo** | Git como única fuente de verdad para la infraestructura |
| **Sincronización Automática** | Detecta y aplica cambios automáticamente |
| **Rollback Instantáneo** | Revertir a cualquier commit con un clic |
| **Multi-clúster** | Gestionar múltiples clústeres desde un solo punto |
| **Interfaz Visual** | Dashboard intuitivo para visualizar estado y relaciones |
| **RBAC Granular** | Control de acceso detallado por proyecto y equipo |
| **Declarativo** | Estado deseado definido en YAML, no scripts imperativos |

:::tip Beneficio Principal
ArgoCD elimina la necesidad de acceso directo al clúster para despliegues. Todo cambio debe pasar por Git, garantizando trazabilidad completa y cumplimiento de políticas de revisión de código.
:::

## Arquitectura

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                              Repositorio Git                                  │
│                                                                               │
│   ┌──────────────────┐   ┌──────────────────┐   ┌─────────────────────────┐  │
│   │  infrastructure/ │   │     argocd/      │   │         src/            │  │
│   │  kubernetes/     │   │     apps/        │   │         backend/        │  │
│   │  - base/         │   │     projects/    │   │         tests/          │  │
│   │  - overlays/     │   │                  │   │                         │  │
│   └────────┬─────────┘   └────────┬─────────┘   └─────────────────────────┘  │
│            │                      │                                           │
└────────────┼──────────────────────┼───────────────────────────────────────────┘
             │                      │
             ▼                      ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                        ArgoCD (namespace: argocd)                             │
│                                                                               │
│   ┌───────────────────┐  ┌───────────────────┐  ┌─────────────────────────┐  │
│   │   Controlador de  │  │    Servidor de    │  │    Servidor de          │  │
│   │   Aplicaciones    │  │    Repositorios   │  │    API/UI               │  │
│   │                   │  │                   │  │                         │  │
│   │   • Monitorea Git │◀─│   • Clona repos   │──│   • Dashboard Web       │  │
│   │   • Reconcilia    │  │   • Renderiza     │  │   • API REST            │  │
│   │   • Sincroniza    │  │   • Cachea        │  │   • gRPC                │  │
│   └───────────────────┘  └───────────────────┘  └─────────────────────────┘  │
│              │                                                                │
│              ▼                                                                │
│   ┌────────────────────────────────────────────────────────────────────────┐ │
│   │                      Clúster de Kubernetes                              │ │
│   │                                                                         │ │
│   │   ┌───────────────────────────────────────────────────────────────┐    │ │
│   │   │                   namespace: finance-app                       │    │ │
│   │   │                                                                │    │ │
│   │   │   Deployment    Service    Ingress    ConfigMap    Secret     │    │ │
│   │   └───────────────────────────────────────────────────────────────┘    │ │
│   └────────────────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────────────┘
```

## Instalación

### Método 1: Script Automatizado (Recomendado)

```bash
chmod +x scripts/setup-argocd.sh
./scripts/setup-argocd.sh
```

El script realiza:
- Creación del namespace
- Instalación de ArgoCD
- Configuración de acceso NodePort
- Extracción de credenciales iniciales

### Método 2: Instalación Manual

```bash
# Crear namespace
kubectl create namespace argocd

# Instalar ArgoCD (versión estable)
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

# Esperar a que esté listo
kubectl wait --for=condition=ready pod \
  -l app.kubernetes.io/name=argocd-server \
  -n argocd \
  --timeout=300s

# Exponer servicio (NodePort para Minikube)
kubectl patch svc argocd-server -n argocd \
  -p '{"spec": {"type": "NodePort"}}'
```

:::note Alta Disponibilidad
Para entornos de producción, considere usar el manifiesto de alta disponibilidad:
```bash
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/ha/install.yaml
```
:::

### Obtener Credenciales

```bash
# Obtener contraseña inicial (usuario: admin)
kubectl -n argocd get secret argocd-initial-admin-secret \
  -o jsonpath="{.data.password}" | base64 -d && echo
```

:::warning Seguridad
Cambie la contraseña inicial inmediatamente después del primer acceso. Elimine el secret después de cambiar la contraseña:
```bash
kubectl delete secret argocd-initial-admin-secret -n argocd
```
:::

### Acceder a ArgoCD

#### Opción 1: NodePort (Minikube)

```bash
ARGOCD_PORT=$(kubectl -n argocd get svc argocd-server \
  -o jsonpath='{.spec.ports[?(@.name=="https")].nodePort}')
echo "ArgoCD UI: https://$(minikube ip):$ARGOCD_PORT"
```

#### Opción 2: Port Forward (Universal)

```bash
kubectl port-forward svc/argocd-server -n argocd 8443:443
# Acceder a https://localhost:8443
```

#### Opción 3: Ingress (Producción)

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: argocd-server-ingress
  namespace: argocd
  annotations:
    nginx.ingress.kubernetes.io/ssl-passthrough: "true"
    nginx.ingress.kubernetes.io/backend-protocol: "HTTPS"
spec:
  ingressClassName: nginx
  rules:
    - host: argocd.example.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: argocd-server
                port:
                  name: https
```

## Configuración

### Proyecto de ArgoCD

El proyecto define los límites de seguridad para las aplicaciones:

```yaml
# argocd/projects/finance-project.yaml
apiVersion: argoproj.io/v1alpha1
kind: AppProject
metadata:
  name: finance-app
  namespace: argocd
  finalizers:
    - resources-finalizer.argocd.argoproj.io
spec:
  description: Proyecto para la aplicación financiera Finance App
  
  # Repositorios permitidos
  sourceRepos:
    - 'https://github.com/tu-organizacion/dotnet-cloud-stack.git'
    - 'https://github.com/tu-organizacion/finance-config.git'
  
  # Destinos permitidos
  destinations:
    - namespace: finance-app
      server: https://kubernetes.default.svc
    - namespace: finance-app-staging
      server: https://kubernetes.default.svc
  
  # Recursos de clúster permitidos
  clusterResourceWhitelist:
    - group: ''
      kind: Namespace
    - group: 'networking.k8s.io'
      kind: Ingress
  
  # Recursos de namespace permitidos
  namespaceResourceWhitelist:
    - group: ''
      kind: ConfigMap
    - group: ''
      kind: Secret
    - group: ''
      kind: Service
    - group: 'apps'
      kind: Deployment
    - group: 'apps'
      kind: StatefulSet
  
  # Roles del proyecto
  roles:
    - name: developer
      description: Rol para desarrolladores
      policies:
        - p, proj:finance-app:developer, applications, get, finance-app/*, allow
        - p, proj:finance-app:developer, applications, sync, finance-app/*, allow
      groups:
        - finance-developers
    
    - name: admin
      description: Rol de administrador del proyecto
      policies:
        - p, proj:finance-app:admin, applications, *, finance-app/*, allow
      groups:
        - finance-admins
```

```bash
# Aplicar proyecto
kubectl apply -f argocd/projects/finance-project.yaml
```

### Aplicación de ArgoCD

Define qué desplegar, de dónde y cómo:

```yaml
# argocd/apps/finance-app-dev.yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: finance-app-dev
  namespace: argocd
  labels:
    app.kubernetes.io/name: finance-app
    environment: development
  finalizers:
    - resources-finalizer.argocd.argoproj.io
spec:
  project: finance-app
  
  source:
    repoURL: https://github.com/tu-organizacion/dotnet-cloud-stack.git
    targetRevision: HEAD  # o rama específica: develop
    path: infrastructure/kubernetes/overlays/dev
  
  destination:
    server: https://kubernetes.default.svc
    namespace: finance-app
  
  syncPolicy:
    automated:
      prune: true           # Eliminar recursos huérfanos
      selfHeal: true        # Auto-corregir desviaciones manuales
      allowEmpty: false     # No permitir sync si no hay recursos
    
    syncOptions:
      - CreateNamespace=true
      - PrunePropagationPolicy=foreground
      - PruneLast=true
    
    retry:
      limit: 5
      backoff:
        duration: 5s
        factor: 2
        maxDuration: 3m
  
  # Verificación de salud personalizada
  ignoreDifferences:
    - group: apps
      kind: Deployment
      jsonPointers:
        - /spec/replicas  # Ignorar cambios de HPA
```

## Flujo de Trabajo GitOps

```
Desarrollador         Repositorio Git           ArgoCD                 Kubernetes
     │                         │                     │                        │
     │  1. git push            │                     │                        │
     │────────────────────────▶│                     │                        │
     │                         │                     │                        │
     │  2. PR + Code Review    │                     │                        │
     │◀────────────────────────│                     │                        │
     │                         │                     │                        │
     │  3. Merge a main        │                     │                        │
     │────────────────────────▶│                     │                        │
     │                         │                     │                        │
     │                         │  4. Webhook/Poll    │                        │
     │                         │────────────────────▶│                        │
     │                         │                     │                        │
     │                         │  5. Git clone       │                        │
     │                         │◀────────────────────│                        │
     │                         │                     │                        │
     │                         │                     │  6. kubectl apply      │
     │                         │                     │───────────────────────▶│
     │                         │                     │                        │
     │                         │                     │  7. Estado aplicado    │
     │                         │                     │◀───────────────────────│
     │                         │                     │                        │
     │  8. Notificación        │                     │                        │
     │◀────────────────────────────────────────────│                        │
```

:::info Frecuencia de Sincronización
Por defecto, ArgoCD consulta los repositorios cada 3 minutos. Para sincronización inmediata, configure webhooks de GitHub/GitLab apuntando a ArgoCD.
:::

## Comandos CLI de ArgoCD

### Instalación del CLI

```bash
# Linux (x86_64)
curl -sSL -o argocd-linux-amd64 \
  https://github.com/argoproj/argo-cd/releases/latest/download/argocd-linux-amd64
sudo install -m 555 argocd-linux-amd64 /usr/local/bin/argocd
rm argocd-linux-amd64

# macOS
brew install argocd

# Verificar instalación
argocd version --client
```

### Iniciar Sesión

```bash
# Login con port-forward activo
argocd login localhost:8443 \
  --username admin \
  --password <contraseña> \
  --insecure

# Login con certificado válido (producción)
argocd login argocd.example.com --sso
```

### Gestión de Aplicaciones

```bash
# Listar todas las aplicaciones
argocd app list

# Ver estado detallado de una aplicación
argocd app get finance-app-dev

# Ver árbol de recursos
argocd app resources finance-app-dev --tree

# Sincronizar manualmente
argocd app sync finance-app-dev

# Sincronizar con opciones específicas
argocd app sync finance-app-dev \
  --prune \
  --force \
  --timeout 120

# Ver diferencias antes de sincronizar
argocd app diff finance-app-dev

# Rollback a revisión específica
argocd app rollback finance-app-dev 1

# Ver historial de despliegues
argocd app history finance-app-dev

# Pausar sincronización automática
argocd app set finance-app-dev --sync-policy none

# Reanudar sincronización automática
argocd app set finance-app-dev \
  --sync-policy automated \
  --self-heal \
  --auto-prune
```

### Gestión de Repositorios

```bash
# Listar repositorios configurados
argocd repo list

# Agregar repositorio privado con HTTPS
argocd repo add https://github.com/org/repo.git \
  --username <usuario> \
  --password <token>

# Agregar repositorio privado con SSH
argocd repo add git@github.com:org/repo.git \
  --ssh-private-key-path ~/.ssh/id_rsa
```

## Configuración para Producción

### Política de Sincronización para Producción

```yaml
# argocd/apps/finance-app-prod.yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: finance-app-prod
  namespace: argocd
spec:
  project: finance-app
  
  source:
    repoURL: https://github.com/tu-organizacion/dotnet-cloud-stack.git
    targetRevision: main  # Solo rama main para producción
    path: infrastructure/kubernetes/overlays/prod
  
  destination:
    server: https://kubernetes.default.svc
    namespace: finance-app-prod
  
  syncPolicy:
    # Sincronización MANUAL para producción
    automated: null
    
    syncOptions:
      - CreateNamespace=true
      - ApplyOutOfSyncOnly=true    # Solo aplicar recursos desincronizados
      - ServerSideApply=true       # Usar Server-Side Apply
      - RespectIgnoreDifferences=true
    
    retry:
      limit: 3
      backoff:
        duration: 5s
        factor: 2
        maxDuration: 1m
```

:::warning Producción
Para producción, siempre use sincronización manual (`automated: null`) para requerir aprobación explícita antes de cada despliegue.
:::

### Notificaciones

#### Slack

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: argocd-notifications-cm
  namespace: argocd
data:
  service.slack: |
    token: $slack-token
    signingSecret: $slack-signing-secret
  
  template.app-deployed: |
    message: |
      :white_check_mark: *{{.app.metadata.name}}* desplegado exitosamente
      Ambiente: {{.app.spec.destination.namespace}}
      Revisión: {{.app.status.sync.revision | substr 0 7}}
      {{if .app.status.operationState.syncResult}}
      Recursos sincronizados: {{len .app.status.operationState.syncResult.resources}}
      {{end}}
    attachments: |
      [{
        "color": "#18be52",
        "fields": [{
          "title": "Repositorio",
          "value": "{{.app.spec.source.repoURL}}",
          "short": true
        }, {
          "title": "Path",
          "value": "{{.app.spec.source.path}}",
          "short": true
        }]
      }]
  
  template.app-sync-failed: |
    message: |
      :x: *{{.app.metadata.name}}* falló al sincronizar
      Ambiente: {{.app.spec.destination.namespace}}
      Error: {{.app.status.operationState.message}}
  
  trigger.on-deployed: |
    - when: app.status.operationState.phase in ['Succeeded'] and app.status.health.status == 'Healthy'
      send: [app-deployed]
  
  trigger.on-sync-failed: |
    - when: app.status.operationState.phase in ['Error', 'Failed']
      send: [app-sync-failed]
```

#### Microsoft Teams

```yaml
data:
  service.teams: |
    recipientUrls:
      - $teams-webhook-url
  
  template.app-deployed-teams: |
    teams:
      title: "Despliegue Exitoso"
      text: "{{.app.metadata.name}} desplegado en {{.app.spec.destination.namespace}}"
      themeColor: "#00FF00"
```

## Mejores Prácticas

### 1. Estructura de Repositorios

```
# Opción A: Monorepo (proyectos pequeños/medianos)
finance-app/
├── src/                    # Código de aplicación
│   └── backend/
├── infrastructure/         # Manifiestos Kubernetes
│   └── kubernetes/
│       ├── base/
│       └── overlays/
│           ├── dev/
│           ├── staging/
│           └── prod/
└── argocd/                 # Configuración ArgoCD
    ├── apps/
    └── projects/

# Opción B: Repos separados (equipos grandes/microservicios)
finance-app/                # Código de aplicación
finance-app-config/         # Manifiestos + ArgoCD
finance-app-infra/          # Terraform IaC
```

### 2. Estrategia de Ramas

| Rama | Ambiente | Sincronización | Aprobación |
|------|----------|----------------|------------|
| `feature/*` | PR Preview | Manual | No |
| `develop` | Desarrollo | Automática | No |
| `staging` | Staging | Automática | No |
| `main` | Producción | Manual | Sí (PR) |

### 3. Gestión de Secretos

Nunca almacene secretos en Git. Use una de estas opciones:

| Solución | Complejidad | Caso de Uso |
|----------|-------------|-------------|
| **Sealed Secrets** | Baja | Equipos pequeños, inicio rápido |
| **External Secrets Operator** | Media | Integración con vaults externos |
| **Azure Key Vault + CSI** | Media | Ambientes Azure nativos |
| **HashiCorp Vault** | Alta | Requisitos enterprise, multi-cloud |

```yaml
# Ejemplo con External Secrets Operator
apiVersion: external-secrets.io/v1beta1
kind: ExternalSecret
metadata:
  name: finance-api-secrets
spec:
  refreshInterval: 1h
  secretStoreRef:
    kind: ClusterSecretStore
    name: azure-keyvault
  target:
    name: finance-api-secrets
    creationPolicy: Owner
  data:
    - secretKey: ConnectionStrings__DefaultConnection
      remoteRef:
        key: finance-db-connection-string
```

### 4. Verificaciones de Salud

```yaml
# Agregar health checks personalizados
apiVersion: argoproj.io/v1alpha1
kind: Application
spec:
  # ... configuración existente ...
  
  # Health checks adicionales
  info:
    - name: url
      value: https://finance.example.com
  
  # Ignorar diferencias esperadas
  ignoreDifferences:
    - group: apps
      kind: Deployment
      jsonPointers:
        - /spec/replicas
    - group: ""
      kind: ConfigMap
      jsonPointers:
        - /data/generated-config
```

## Solución de Problemas

### Aplicación Fuera de Sincronización (OutOfSync)

```bash
# Ver diferencias detalladas
argocd app diff finance-app-dev

# Ver qué recursos están desincronizados
argocd app get finance-app-dev -o wide

# Forzar sincronización
argocd app sync finance-app-dev --force

# Si hay recursos huérfanos
argocd app sync finance-app-dev --prune
```

### Error de Permisos RBAC

```bash
# Verificar permisos del service account de ArgoCD
kubectl auth can-i create deployments \
  -n finance-app \
  --as system:serviceaccount:argocd:argocd-application-controller

# Ver logs del controlador
kubectl logs -n argocd deployment/argocd-application-controller
```

### Repositorio no Accesible

```bash
# Verificar conexión al repo
argocd repo list

# Probar conexión
argocd repo get https://github.com/org/repo.git

# Re-agregar repositorio
argocd repo rm https://github.com/org/repo.git
argocd repo add https://github.com/org/repo.git \
  --username <user> \
  --password <token>
```

### Aplicación en Estado "Unknown"

```bash
# Refrescar estado de la aplicación
argocd app get finance-app-dev --refresh

# Forzar hard refresh (re-clona el repo)
argocd app get finance-app-dev --hard-refresh

# Verificar conectividad al servidor de API
kubectl cluster-info
```

### Recursos Duplicados

```bash
# Verificar si hay recursos gestionados por múltiples aplicaciones
kubectl get all -n finance-app -o yaml | grep argocd.argoproj.io/tracking-id

# Resolver conflictos editando las aplicaciones
argocd app set finance-app-dev --ignore-differences
```

## Comandos de Referencia Rápida

| Operación | Comando |
|-----------|---------|
| Ver todas las apps | `argocd app list` |
| Estado de app | `argocd app get <app>` |
| Sincronizar | `argocd app sync <app>` |
| Ver diferencias | `argocd app diff <app>` |
| Rollback | `argocd app rollback <app> <revision>` |
| Historial | `argocd app history <app>` |
| Eliminar app | `argocd app delete <app>` |
| Logs en tiempo real | `argocd app logs <app> -f` |

## Siguiente Paso

Con ArgoCD configurado, puede proceder a configurar la [Infraestructura en Azure AKS](./azure-aks) para despliegues en producción.