import React, { JSX } from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Head from '@docusaurus/Head';
import { 
  FiBox, 
  FiDatabase, 
  FiShield, 
  FiZap,
  FiLayers,
  FiServer,
  FiCode,
  FiTool,
  FiArrowRight,
  FiCheckCircle,
  FiGitBranch,
  FiActivity,
  FiBook,
  FiUsers,
  FiCreditCard,
  FiSmartphone,
  FiDollarSign,
  FiTrendingUp
} from 'react-icons/fi';
import styles from './index.module.css';

// Hero Section - Tienda Pago
function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.heroBackground}>
        <div className={styles.heroGrid}></div>
        <div className={styles.heroGlow}></div>
        <div className={styles.heroParticles}>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
      <div className="container">
        <div className={styles.heroContent}>
          <div className={styles.heroLabel}>
            <span className={styles.labelDot}></span>
            <span>Documentación Técnica</span>
          </div>
          <h1 className={styles.heroTitle}>
            <span className={styles.heroGradient}>Tienda Pago</span>
          </h1>
          <p className={styles.heroDescription}>
            Documentación técnica completa de nuestra plataforma fintech. 
            APIs, integraciones, guías de desarrollo y recursos para equipos técnicos.
          </p>
          <div className={styles.heroButtons}>
            <Link to="/docs/" className={styles.btnPrimary}>
              <span>Explorar Documentación</span>
              <FiArrowRight />
            </Link>
            <Link to="/docs/" className={styles.btnSecondary}>
              <FiBook />
              <span>Guías Rápidas</span>
            </Link>
          </div>
        </div>
      </div>
      <div className={styles.heroWave}>
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,64L60,69.3C120,75,240,85,360,80C480,75,600,53,720,48C840,43,960,53,1080,58.7C1200,64,1320,64,1380,64L1440,64L1440,120L1380,120C1320,120,1200,120,1080,120C960,120,840,120,720,120C600,120,480,120,360,120C240,120,120,120,60,120L0,120Z" fill="#fafcff"/>
        </svg>
      </div>
    </section>
  );
}

// Projects Section - Tienda Pago Services
function Projects() {
  const projects = [
    {
      title: 'API de Pagos',
      description: 'Integración completa con nuestra API de pagos. Procesa transacciones, gestiona tokens y maneja callbacks de manera segura.',
      icon: <FiCreditCard />,
      link: '/docs/api/pagos',
      badges: [
        { text: 'Producción', color: '#00B67A' },
        { text: 'REST API', color: '#007A5E' }
      ]
    },
    {
      title: 'Sistema de Créditos',
      description: 'Documentación del motor de scoring y líneas de crédito. Algoritmos de evaluación y gestión de riesgo financiero.',
      icon: <FiDollarSign />,
      link: '/docs/creditos',
      badges: [
        { text: 'Producción', color: '#00B67A' },
        { text: 'Core', color: '#007A5E' }
      ]
    },
    {
      title: 'App Móvil',
      description: 'SDK y documentación para integración con nuestra aplicación móvil. WhatsApp Business API y notificaciones.',
      icon: <FiSmartphone />,
      link: '/docs/mobile',
      badges: [
        { text: 'Producción', color: '#00B67A' },
        { text: 'SDK', color: '#FF6B35' }
      ]
    },
    {
      title: 'Portal de Comercios',
      description: 'Documentación del dashboard para comercios afiliados. Gestión de inventario, reportes y analytics.',
      icon: <FiTrendingUp />,
      link: '/docs/portal-comercios',
      badges: [
        { text: 'Producción', color: '#00B67A' },
        { text: 'WEB', color: '#007A5E' }
      ]
    },
    {
      title: 'Integraciones CPG',
      description: 'Conectores con marcas de consumo masivo. Arca Continental, Heineken, Grupo Modelo y más distribuidores.',
      icon: <FiGitBranch />,
      link: '/docs/integraciones',
      badges: [
        { text: 'Producción', color: '#00B67A' },
        { text: 'B2B', color: '#007A5E' }
      ]
    },
    {
      title: 'Sistema de Recargas',
      description: 'API para venta de recargas telefónicas. Integración con operadores móviles y gestión de comisiones.',
      icon: <FiZap />,
      link: '/docs/recargas',
      badges: [
        { text: 'Producción', color: '#00B67A' },
        { text: 'API', color: '#FF6B35' }
      ]
    },
    {
      title: 'Puntos de Pago',
      description: 'Red de puntos de pago para liquidación de créditos. Integración con bancos y comercios afiliados.',
      icon: <FiBox />,
      link: '/docs/puntos-pago',
      badges: [
        { text: 'Producción', color: '#00B67A' },
        { text: 'Network', color: '#007A5E' }
      ]
    },
    {
      title: 'Analytics & Reporting',
      description: 'Plataforma de analytics y reportes. Data warehouse, dashboards en tiempo real y exportación de datos.',
      icon: <FiActivity />,
      link: '/docs/analytics',
      badges: [
        { text: 'Producción', color: '#00B67A' },
        { text: 'Data', color: '#FF6B35' }
      ]
    }
  ];

  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Servicios Documentados</h2>
          <p className={styles.sectionSubtitle}>
            Explora la documentación técnica de todos nuestros servicios y plataformas
          </p>
        </div>
        <div className={styles.projectsGrid}>
          {projects.map((project, index) => (
            <Link
              key={index}
              to={project.link}
              className={styles.projectCard}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={styles.cardIcon}>
                {project.icon}
              </div>
              <div className={styles.cardBadges}>
                {project.badges.map((badge, idx) => (
                  <div 
                    key={idx} 
                    className={styles.cardBadge} 
                    style={{ backgroundColor: badge.color }}
                  >
                    {badge.text}
                  </div>
                ))}
              </div>
              <h3 className={styles.cardTitle}>{project.title}</h3>
              <p className={styles.cardDescription}>{project.description}</p>
              <div className={styles.cardArrow}>
                <span>Ver documentación</span>
                <FiArrowRight />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// Features Section
function Features() {
  const features = [
    {
      title: 'API First',
      description: 'Documentación completa de endpoints REST. Ejemplos en múltiples lenguajes y sandbox para pruebas.',
      icon: <FiServer />
    },
    {
      title: 'Seguridad',
      description: 'Guías de autenticación OAuth 2.0, manejo de tokens y mejores prácticas de seguridad.',
      icon: <FiShield />
    },
    {
      title: 'Webhooks',
      description: 'Sistema de callbacks en tiempo real. Notificaciones de transacciones y cambios de estado.',
      icon: <FiZap />
    },
    {
      title: 'SDKs',
      description: 'Librerías oficiales para iOS, Android, Python, Node.js y más. Instalación en minutos.',
      icon: <FiCode />
    },
    {
      title: 'Sandbox',
      description: 'Ambiente de pruebas completo. Simula transacciones sin afectar datos reales.',
      icon: <FiTool />
    },
    {
      title: 'Soporte Técnico',
      description: 'Equipo de ingeniería disponible para resolver dudas de integración.',
      icon: <FiUsers />
    }
  ];
}

// Resources Section
function Resources() {
  const resources = [
    {
      title: 'Guías de Inicio',
      description: 'Tutoriales paso a paso para comenzar tu integración',
      icon: <FiBook />,
      link: '/docs/guides'
    },
    {
      title: 'API Reference',
      description: 'Documentación completa de todos los endpoints',
      icon: <FiServer />,
      link: '/docs/api/overview'
    },
    {
      title: 'Arquitectura',
      description: 'Diagramas y explicaciones de la infraestructura',
      icon: <FiLayers />,
      link: '/docs/architecture/overview'
    }
  ];
}

// Main Component
export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  
  return (
    <Layout>
      <Head>
        <title>Tienda Pago - Documentación Técnica</title>
        <meta name="description" content="Documentación técnica de la plataforma Tienda Pago. APIs, SDKs, guías de integración y recursos para desarrolladores." />
      </Head>
      <main className={styles.main}>
        <Hero />
        <Projects />
      </main>
    </Layout>
  );
}