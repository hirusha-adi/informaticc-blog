---
title: Intermediate Linux Hardening for a VPS Bro (Incomplete)
authors: [hirusha]
tags: [linux,vps,security,hardening]
---

There's a backstory behind this blog post but publicly sharing it is not the greatest idea. This post will cover some interesting hardening ideas to protect your VPS. Note that this is not a step by step guide; rather, this provides an overview of some cool things you could do. Everything mentioned here is just surface level.

![alt text](image.png)

<!--truncate-->

This post is about hardening a Debian server. If you don't like debian, AlmaLinux is an awesome alternative. It even has SELinux set up to "default-deny" out of the box.

It's always a good idea to begin by updating everything to the latest version. Create a non-root user and add them to the sudoers file. If you are running any services without docker, you should consider creating a custom user account. If possible, set the default shell to noshell. If you are planning to use docker, setting it up the root-less way is a great idea.

Set the system's timezone according to your need. Haveged is to nice to have as a source of entropy in your server to create random data more securely.

Disable root login via SSH. Change the default port to anything other than 22 or 2222 to hide it from automated scanners. Only enabled public key based authentication for now. Set other things up in your ssh config based on your needs. Ensure to disable any unused feature and allow users explicitly by their user name.

Next, set up fail2ban and configure the SSH jail. You can also write custom filters and setup fail2ban on any other custom service of our choice. It can be easily done if your service logs to a file.

Enabling automatic security updates is a good idea. Something that a lot of tutorials don't mention to set the default security origin. Make sure to set it up properly. You might not want to do this if you want a 100% uptime, though the chances of it restarting is extremely low.

For the firewall, it's always a good idea to stick with an default-deny configuration. Then, introduce the services that you want to expose publicly. If you are using docker, make sure to trust the docker interface and let it do whatever it wants to do. Otherwise, it will break inter-container communications and a lot of other things. From my personal experience, `ufw` has been a bit too simple to let me do that, so, if you are using debian, use `iptables` or if you are using something redhat based, use `firewalld`. You can either use the firewall (preferred) or use kernel parameters to disable IPv6 traffic if it's not being used.

For credentials, you can have a seperate directory to store that. Ensure to setup permissions for this directory properly. Using user groups might be a simple option here or even ACLs. Pick whatever is the best option based on your needs. Point your applications to files in this directory as needed.

If you are not using docker, make sure to set logging up properly with journald. Install and set up logrotate. Setup backups with something like rsync to another server that you trust.

If you want to go full paranoid on your SSH access, you can do one of these:
- If you have a static IP, only allow ssh traffic from that IP.
- Otherwise, you can consider adding your server to a tailscale network and update your firewall rules to only allow ssh traffic from this network. This of course introduces a new attack surface (tailscale) but it's obviously better than allowing traffic from any public ip.

To further harden shell access, you can look into using certain pluggable authentication modules (PAM) like the Google Authenticator and/or YubiCo/YubiKey PAM modules.

Whatever the application you are downloading, ensure it's downloaded from the correct source if it's not from debian's official repositories. Validate everything. Don't run random installation scripts you find on github unless you go through it thoroughly and understand what it does.

The key here is that you don't trust anything. Stick with a zero trust design from the grounds up and slowly enable everything you trust.
