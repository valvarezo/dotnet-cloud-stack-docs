import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Tienda Pago',
  tagline: 'Documentación Técnica',
  favicon: 'img/favicon.ico',

  url: 'https://docs.tiendapago.com',
  baseUrl: '/',

  organizationName: 'tiendapago',
  projectName: 'tiendapago-docs',

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'es',
    locales: ['es'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    navbar: {
      title: 'Tienda Pago',
      logo: {
        alt: 'Tienda Pago Logo',
        src: 'https://tiendapago.com/_astro/header-logo.CO-fChkg_22UKDs.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Documentación',
        },
        {
          href: 'https://github.com/tiendapago',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Documentación',
          items: [
            { label: 'Introducción', to: '/docs/intro' },
          ],
        },
        {
          title: 'Comunidad',
          items: [
            { label: 'LinkedIn', href: 'https://www.linkedin.com/company/tienda-pago' },
          ],
        },
        {
          title: 'Más',
          items: [
            { label: 'Tienda Pago', href: 'https://tiendapago.com' },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Tienda Pago. Todos los derechos reservados.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;