// See: https://docusaurus.io/docs/api/docusaurus-config
// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

import { themes as prismThemes } from 'prism-react-renderer';


/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'InformatiCC',
  tagline: 'A technical blog covering all aspects related to technology.',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://informati.cc',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'hirusha-adi', // Usually your GitHub org/user name.
  projectName: 'informaticc-blog', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // NO! ONLY ENGLISH!
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/docusaurus-social-card.jpg',
      navbar: {
        title: 'My Site',
        logo: {
          alt: 'My Site Logo',
          src: 'img/logo.svg',
        },
        items: [
          // RE_ENABLE_DOCS:
          //    to enable docs, uncomment this section
          // ---------------------------------------
          // {
          //   type: 'docSidebar',
          //   sidebarId: 'tutorialSidebar',
          //   position: 'left',
          //   label: 'Tutorial',
          // },
          // ---------------------------------------
          { to: '/blog', label: 'Blog', position: 'left' },
          {
            href: 'https://github.com/facebook/docusaurus',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Tutorial',
                to: '/docs/intro',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'Stack Overflow',
                href: 'https://stackoverflow.com/questions/tagged/docusaurus',
              },
              {
                label: 'Discord',
                href: 'https://discordapp.com/invite/docusaurus',
              },
              {
                label: 'X',
                href: 'https://x.com/docusaurus',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'Blog',
                to: '/blog',
              },
              {
                label: 'GitHub',
                href: 'https://github.com/facebook/docusaurus',
              },
            ],
          },
        ],
        copyright: `Copyright © 2020-${new Date().getFullYear()} INFORMATI.CC`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.vsDark, // `prismThemes.oneDark` was in previous one 
        additionalLanguages: [
          'bash',
          'json',
          'java',
          'python',
          'php',
          'graphql',
          'rust',
          'toml',
          'protobuf',
          'prolog',
          'diff',
          'ini',
        ],
        defaultLanguage: 'python',
      },
    }),

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        // RE_ENABLE_DOCS:
        //    to enable docs, uncomment this section
        // ---------------------------------------
        // docs: {
        //   sidebarPath: './sidebars.js',
        //   // Please change this to your repo.
        //   // Remove this to remove the "edit this page" links.
        //   editUrl:
        //     'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        // },
        // ---------------------------------------
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
          // Useful options to enforce blogging best practices
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
        sitemap: {
          lastmod: 'date',
          changefreq: 'weekly',
          priority: 0.5,
          ignorePatterns: ['/tags/**'],
          filename: 'sitemap.xml',
          createSitemapItems: async (params) => {
            const { defaultCreateSitemapItems, ...rest } = params;
            const items = await defaultCreateSitemapItems(rest);
            return items.filter((item) => !item.url.includes('/page/'));
          },
        },
      }),
    ],
  ],

  plugins: [
    // ... Your other plugins.
    [
      require.resolve('docusaurus-plugin-search-local'),
      {
        // Options: https://github.com/gabrielcsapo/docusaurus-plugin-search-local?tab=readme-ov-file#plugin-options
        hashed: true,

        indexBlog: true,
        blogRouteBasePath: "/blog",
        blogDir: "blog",

        indexDocs: true,
        docsRouteBasePath: "/docs",
        docsDir: "docs",
      },
    ],
    ['@docusaurus/plugin-ideal-image', { disableInDev: false }],
  ],
};

export default config;
