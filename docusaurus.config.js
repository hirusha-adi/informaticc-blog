// See: https://docusaurus.io/docs/api/docusaurus-config
// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

import { themes as prismThemes } from 'prism-react-renderer';


/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'informaticc',
  tagline: 'A technical blog covering all aspects related to technology.',
  favicon: 'img/icon.png',

  url: 'https://informati.cc',
  baseUrl: '/',
  trailingSlash: false,

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
        // title: 'My Site', // removed the title
        logo: {
          alt: 'informati.cc',
          src: 'img/logo.png',
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
          {
            to: '/blog',
            label: 'Blog',
            position: 'right'
          },
          {
            to: '/blog/tags',
            label: 'Tags',
            position: 'right'
          },
          {
            to: '/blog/archive',
            label: 'Archive',
            position: 'right'
          },
          {
            to: '/legal',
            label: 'Legal',
            position: 'right'
          }
        ],
      },
      footer: {
        style: 'dark',
        links: [
          // removed all footer links
          // ------------------------------
          // // column 1
          // {
          //   title: 'Docs',
          //   items: [
          //     {
          //       label: 'Tutorial',
          //       to: '/docs/intro',
          //     },
          //   ],
          // },
          // // column 2
          // {
          //   title: 'More',
          //   items: [
          //     {
          //       label: 'Blog',
          //       to: '/blog',
          //     },
          //     {
          //       label: 'GitHub',
          //       href: 'https://github.com/facebook/docusaurus',
          //     },
          //   ],
          // },
          // // duplicate the above dict again for another column
        ],
        copyright: `Copyright © 2020-${new Date().getFullYear()} informati.cc`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.oneDark, // `prismThemes.vsDark` was in previous one 
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

      // reference: https://docusaurus.io/docs/api/themes/configuration#color-mode---dark-mode
      colorMode: {
        // (make the website dark mode only)
        defaultMode: 'dark',
        disableSwitch: true,
        // respectPrefersColorScheme: true, // no idea, this breaks stuff - so i commented this
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

  scripts: [
    // Based on: https://github.com/Swetrix/docs/blob/main/docusaurus.config.js
    {
      src: 'https://cdn.jsdelivr.net/gh/Swetrix/swetrix-js@latest/dist/swetrix.js', defer: true,
    },
    {
      src: 'js/setupswetrix.js', defer: true,
    }
  ],
};

export default config;
