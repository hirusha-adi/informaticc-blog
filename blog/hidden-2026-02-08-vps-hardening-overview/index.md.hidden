---
title: An overview of Linux Hardening for a VPS Bro
authors: [hirusha]
tags: [linux,vps,security,hardening]
---

There's a backstory behind this blog post but publicly sharing it is not the greatest idea. This post will cover some interesting hardening ideas to protect your VPS. Note that this is not a step by step guide; rather, this provides an overview of some cool things you could do. Everything mentioned here is just surface level.

<!--truncate-->

This post is about hardening a Debian server. If you don't like debian, AlmaLinux is an awesome RedHad based alternative. It even has SELinux set up to "default-deny" out of the box.

It's always a good idea to begin by updating everything to the latest version. Create a non-root user and add them to the sudoers file. If you are running any services without Docker, you should consider creating a custom user account. If possible, set the default shell to `noshell`. If you are planning to use Docker, setting it up the root-less way is a great idea.

Set the system's timezone according to your needs. Install and set up haveged. This deamon will help increase the entropy pool of your system. It will help generate random data more efficiently and securely.

Disable root login via SSH. Change the default port to anything other than 22 or 2222 to hide it from automated scanners. Only enable public key-based authentication for now. Set other things up in your SSH config based on your needs. Ensure you disable any unused features and allow users explicitly by their username.

Next, set up fail2ban and configure the SSH jail. You can also write custom filters and set up fail2ban on any other custom service of your choice. This can be easily done if your service logs to a file.

Enabling automatic security updates is a good idea. Something that a lot of tutorials don't mention is setting the default security origin. Make sure to set it up properly. You might not want to do this if you require 100% uptime, though the chances of a restart are extremely low.

For the firewall, it's always a good idea to stick with a default-deny configuration. Then, introduce the services that you want to expose publicly. If you are using Docker, make sure to trust the Docker interface and let it do whatever it wants to do. Otherwise, it will break inter-container communications and a lot of other things. From my personal experience, `ufw` has been a bit too simple to allow that. So, if you are using Debian, use `iptables`, or if you are using something Red Hat-based, use `firewalld`. You can either use the firewall (preferred) or use kernel parameters to disable IPv6 traffic if it's not being used.

For credentials, you can have a separate directory to store them. Ensure that permissions for this directory are set properly. Using user groups might be a simple option here, or even ACLs. Pick whatever is the best option based on your needs. Point your applications to files in this directory as needed.

If you are not using Docker, make sure to set up logging properly with `journald`. Install and set up `logrotate`. Set up backups with something like `rsync` to another server that you trust.

If you want to go full paranoid on your SSH access, you can do one of these:
- If you have a static IP, only allow SSH traffic from that IP.
- Otherwise, you can consider adding your server to a Tailscale network and update your firewall rules to only allow SSH traffic from this network. This, of course, introduces a new attack surface (Tailscale), but it's obviously better than allowing traffic from any public IP.

To further harden shell access, you can look into using certain pluggable authentication modules (PAM), like the Google Authenticator and/or YubiCo/YubiKey PAM modules.

Whatever the application you are downloading, ensure it's downloaded from the correct source if it's not from Debian's official repositories. Validate everything. Don't run random installation scripts you find on GitHub unless you go through them thoroughly and understand what they do.

The key here is that you don't trust anything. Stick with a zero-trust design from the ground up and slowly enable everything you trust.
