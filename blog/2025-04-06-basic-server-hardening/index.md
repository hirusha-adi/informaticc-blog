---
title: Basic Server Hardening Guide (INCOMPLETE)
authors: [hirusha]
tags: [linux,hardening,security]
---

If you don't like big tech companies prying their eyes on your data, you might want to self host all the services either locally on-premise or on a cloud server (a Virtual Private Server or a Dedicated Server). 

When you are doing this, yes, you are safe from the eyes of big tech, and you actually get to have some privacy. HOWEVER, you will be in charge of your own data security. Therefore, hardening your server is essential to keep your data secure from bad actors and sometimes even automated scanners.

In this article, let's see how to do just that. This guide focuses on Debian 12 (not Ubuntu, since it's Canonical's bloat). Let's get started.

<!--truncate-->

After the server is up and running, log in as the `root` user to get started.

### Initial Setup

Let's get started by updating all the repositories and upgrading all the installed packages.

```bash
apt update 
apt upgrade
```

Then, let's create a new user called `debian`. It's always best practice to leave the `root` user alone. Then, we will log back in / or switch to the user `debian` before running all the other commands.

Let's first create the new user.

```bash
adduser debian
```

Lets also add the newly created user to the `sudo` group. This will allow the user to run commands as root without really having to switch the user.

```bash
usermod -aG sudo debian
```

Now, lets switch from `root` user to the newly created user.

```bash
su debian
```

Then, come to your home directory.

```bash
cd ~

# or cd into the absolute path
cd /home/debian/ 
```

### SSH Setup

Assuming that you've already logged using SSH, you have it up and running. 

Let's now copy the user's public key. Refer to my [old article](https://informati.cc/blog/2022/12/24/ssh-setup) about using SSH securely for more information.

```bash
# setup the ~/.ssh directory
mkdir -p /home/debian/.ssh
sudo chown -R debian:debian /home/debian/.ssh
sudo chmod 700 /home/debian/.ssh

# setup the `authorized_keys` file
touch /home/debian/.ssh/authorized_keys
sudo chmod 600 /home/debian/.ssh/authorized_keys
```

Now, add your public keys to the `authorized_keys` file since we will be disabling password login later.

```bash
nano /home/debian/.ssh/authorized_keys
```

It should now look something like this:

![alt text](image.png)

It should update automatically, but just to be safe - lets restart sshd service.

```bash
sudo systemctl restart sshd
```

To test this, try to log back in again as the user `debian` and if everything went correctly, you should be able to log in without entering the password.

Let's now make SSH secure by adjusting some settings of it's configuration file at `/etc/ssh/sshd_config`

```bash
sudo nano /etc/ssh/sshd_config
```

Change these options as follows:

```bash
# don't anyone to log in as the root user
PermitRootLogin no

# disable logging in using the password
PasswordAuthentication no

# enable public key authentication
PubkeyAuthentication yes
```

Then, restart the ssh service again for the changes to apply.

```bash
sudo systemctl restart ssh
```




