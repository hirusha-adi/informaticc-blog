---
title: Setup SSH Securely, with Password-less Login
authors: [hirusha]
tags: [sysadmin,ssh,linux,tutorial]
---

SSH (Secure Shell) is a protocol used to securely connect to a remote computer or server over a network. It allows you to execute commands, manage files, and perform administrative tasks remotely.

![alt text](image.png)

<!--truncate-->

## Setup OpenSSH

[OpenSSH](https://www.openssh.com/) is a connectivity tool for remote sign-in that uses the SSH protocol. In this post, we will see how to set it up.

### Server

If you're setting up SSH on a Debian or Ubuntu server, you'll need to install the OpenSSH server first. Most of the time, if you purchase a VPS or a dedicated server, you will have this set up and enabled by default.

- Update package lists:
   ```bash
   sudo apt update
   ```

- Install OpenSSH server:
   ```bash
   sudo apt install openssh-server -y
   ```

- Enable and start the SSH service:
   ```bash
   sudo systemctl enable ssh
   sudo systemctl start ssh
   ```

- Verify that SSH is running:
   ```bash
   sudo systemctl status ssh
   ```

- If you cannot connect to it, adjusting the firewall settings to allow SSH connections might fix the issue, especially on Ubuntu Server instances.
    ```bash
    sudo ufw allow OpenSSH
    sudo ufw enable
    ```

### Client

To connect to an OpenSSH server, you need an SSH client installed on your device.  

#### Windows  

Windows includes a built-in OpenSSH client, but you can also use third-party tools like [PuTTY](https://www.putty.org/), [Termius](https://termius.com/), or [XShell](https://www.netsarang.com/en/xshell/).  

1. Open Command Prompt or PowerShell.  
2. Check if OpenSSH is installed:  
   ```powershell
   ssh -V
   ```
3. If not installed, install it via PowerShell:  
   ```powershell
   Add-WindowsFeature -Name OpenSSH-Client
   ```
4. If the above command doesn't work:  
   - Go to **Settings → Apps → Optional Features**  
   - Find and install **OpenSSH Client**  

#### Linux & macOS  

SSH is pre-installed on most Linux distributions and macOS versions.  

To verify its installation, run:  
```bash
ssh -v
``` 

If SSH is missing, install it via your package manager:  
- Debian/Ubuntu: `sudo apt install openssh-client`  
- Arch Linux: `sudo pacman -S openssh`  
- macOS (if missing): `brew install openssh`

## Basic Guide

#### Connecting via SSH

- Open your terminal (on macOS, Linux, or Windows via PowerShell).
- Use the following command:
    ```
    ssh username@hostname_or_ip
    ```
    - `username`: The user on the remote server.
    - `hostname_or_ip`: The remote server’s IP address or domain name.
    
    For example:
    ```
    ssh hirusha@192.168.1.100
    ```

- Authenticate: you'll be prompted to enter the password.


## Setup Password-less Login

### Generate Key Pair

Open a terminal and run:

```bash
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
```

- `-t rsa`: Uses RSA as the algorithm.
- `-b 4096`: Sets a strong 4096-bit key length.
- `-C`: Adds an optional comment (like your email) for identification.

Press `Enter` to save it in the default location. 

Two files will be generated: `id_rsa`, the private key, which you should not share with anyone; and `id_rsa.pub`, the public key. This should be added to the server. Once it's set up, you can authenticate using the matching private key of this key pair.

The default file locations are:
- Linux: `~/.ssh/id_rsa` and `~/.ssh/id_rsa.pub`
- Windows: `C:\Users\%USERNAME%\.ssh\id_rsa` and `C:\Users\%USERNAME%\.ssh\id_rsa.pub`

You can also set a passphrase for extra security (optional but recommended).

### Copy the Public Key

As mentioned above, the public key should be added to the the authorized keys of server.

#### Linux / MacOS

Linux and MacOS installations of OpenSSH client also comes with the `ssh-copy-id` tool to make things easy for you.

```bash
ssh-copy-id -i ~/.ssh/id_rsa.pub user@remote_host
```

This automatically adds your public key to the server. 

#### Windows

The `ssh-copy-id` tool is not natively available on Windows, so you need to do it manually:

1. Open your public key file in Notepad:

   ```bash
   notepad C:\Users\%USERNAME%\.ssh\id_rsa.pub
   ```

2. Copy the entire content.

3. Log in to the remote server using your password:

   ```bash
   ssh user@remote_host
   ```

4. On the server, append the key to `~/.ssh/authorized_keys` into a new line:

   ```bash
   mkdir -p ~/.ssh
   echo "your-public-key-content" >> ~/.ssh/authorized_keys
   chmod 600 ~/.ssh/authorized_keys
   chmod 700 ~/.ssh
   ```
  
Note that if you are setting this up for another user, either log in as that user and then run the above commands, or just ensure that you place the public key inside the `.ssh/authorized_keys` file in that user's home folder.

### Test

Now, try logging in:

```bash
ssh user@remote_host
```

If everything is set up correctly, you should log in without entering a password.

### (Optional) Passphrase Setup

If you set a passphrase, you'll have to enter it every time. To avoid that, use `ssh-agent`:

#### Linux/macOS
```bash
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_rsa
```

#### Windows
```powershell
Start-Service ssh-agent
ssh-add C:\Users\%USERNAME%\.ssh\id_rsa
```

To make SSH agent start automatically on reboot:

```powershell
Set-Service -Name ssh-agent -StartupType Automatic
```

### Setup Multiple Keys

If you have multiple SSH keys (for GitHub, different servers, etc...), you can create an SSH config file:

1. Open the SSH config file:
   
   Linux/macOS:
   ```bash
   nano ~/.ssh/config
   ```
   
   Windows:
   ```powershell
   notepad C:\Users\%USERNAME%\.ssh\config
   ```

2. Add your configuration:

   ```plaintext
   Host myserver
       HostName remote_host
       User your_user
       IdentityFile ~/.ssh/id_rsa
   ```

   For example:

   ```plaintext
   Host myserver
       HostName 192.168.1.100
       User root
       IdentityFile C:\Users\hirusha\.ssh\id_rsa
   ```

Now, you can simply type:

```bash
ssh myserver
```

instead of the full `ssh user@remote_host`.
