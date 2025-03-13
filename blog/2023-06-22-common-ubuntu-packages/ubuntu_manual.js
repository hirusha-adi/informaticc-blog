import React from 'react';
import CommandGenWithCheckbox from '@site/src/components/CommandGenWithCheckbox';

const baseCommand = 'sudo apt install ';
const softwareData = [
    {
        category: 'Browser',
        items: [
            { name: 'Firefox', command: 'firefox' },
        ]
    },
    {
        category: 'Utilities',
        items: [
            { name: 'Yakuake (for KDE)', command: 'yakuake' },
            { name: 'Guake (for GNOME)', command: 'guake' },
            { name: 'ffmpegthumbs', command: 'ffmpegthumbs' },
            { name: 'mplayerthumbs', command: 'mplayerthumbs' },
            { name: 'qbittorrent', command: 'qbittorrent' },
            { name: 'KDE-Connect (Phone Sync)', command: 'kdeconnect' },
        ]
    },
    {
        category: 'Media',
        items: [
            { name: 'Audacity (Audio Editor)', command: 'audacity' },
            { name: 'RawTherapee (Image Editor)', command: 'rawtherapee' },
            { name: 'Pinta (Image Editor)', command: 'pinta' },
            { name: 'KdenLive (Video Editor)', command: 'kdenlive' },
            { name: 'OpenShot (Video Editor)', command: 'openshot-qt' },
            { name: 'Shotcut (Video Editor)', command: 'shotcut' },
            { name: 'yt-dlp (Video Downloader)', command: 'yt-dlp' },
            { name: 'HandBrake (Video Transcoder)', command: 'handbrake' },
        ]
    },
    {
        category: 'System Monitor',
        items: [
            { name: 'neofetch', command: 'neofetch' },
            { name: 'bpytop', command: 'bpytop' },
        ]
    },
    {
        category: 'Password Manager',
        items: [
            { name: 'KeepassXC', command: 'keepassxc' },
        ]
    },
    {
        category: 'Development',
        items: [
            { name: 'Git', command: 'git' },
            { name: 'VirtualBox', command: 'virtualbox' },
            { name: 'OpenJDK v8', command: 'openjdk-8-jdk' },
            { name: 'NodeJS', command: 'nodejs' },
            { name: 'Eclipse', command: 'eclipse' },
            { name: 'NPM', command: 'npm' },
            { name: 'TCL', command: 'tcl' },
            { name: 'FPC', command: 'fpc' },
            { name: 'NotepadQQ', command: 'notepadqq' },
            { name: 'codeblocks', command: 'codeblocks' },
        ]
    },
    {
        category: 'Options in yay',
        items: [
            { name: '--yes (Auto-approve installation)', command: '--yes' },
            { name: '-qq (Quiet mode)', command: '-qq' },
            { name: '--fix-broken (Fix broken dependencies)', command: '--fix-broken' },
            { name: '--no-install-recommends (Skip recommended packages)', command: '--no-install-recommends' },
            { name: '--no-upgrade (Prevent upgrades)', command: '--no-upgrade' },
            { name: '--reinstall (Reinstall a package)', command: '--reinstall' },
            { name: '--purge (Remove with config)', command: '--purge' },
            { name: '--dry-run (Simulate installation)', command: '--dry-run' },
            { name: '--download-only (Fetch packages only)', command: '--download-only' },
            { name: '--print-uris (Display package URIs)', command: '--print-uris' },
            { name: '--show-progress (Show download progress)', command: '--show-progress' },
            { name: '--list-cleanup (Clean package list)', command: '--list-cleanup' },
        ]
    },

    // uncomment and add more stuff later
    // ------------------------------------------------------------
    // {
    //     category: 'Media',
    //     items: [
    //          { name: 'Application Name', command: 'poackage-name-in-aur' },
    //         // items
    //     ]
    // },

];

function UbuntuManualSetup() {
    return (
        <div>
            <CommandGenWithCheckbox baseCommand={baseCommand} softwareData={softwareData} />
        </div>
    );
}


export default UbuntuManualSetup;