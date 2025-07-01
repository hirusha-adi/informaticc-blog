import React, { useEffect } from 'react';
import 'artalk/dist/Artalk.css';
import BrowserOnly from '@docusaurus/BrowserOnly';

export function Comments() {
  return (
    <BrowserOnly fallback={<div>Loading Comments...</div>}>
      {() => <ArtalkContainer />}
    </BrowserOnly>
  );
}

function ArtalkContainer() {
  useEffect(() => {
    const Artalk = require('artalk').default;

    Artalk.init({
      el: '#comment',
      pageKey: window.location.pathname,
      pageTitle: document.title,
      server: 'https://comments.informati.cc/',
      site: 'Informaticc Blog',
      versionCheck: false, // Important to disable version check!
      darkMode: true
    });
  }, []);

  return <div id="comment" className="artalk-comments" />;
}
