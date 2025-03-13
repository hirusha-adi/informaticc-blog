---
title: Autostart Services with Systemd in Linux
authors: [hirusha]
tags: [sysadmin,systemd,linux,tutorial]
---

Automating the startup of services in Linux is crucial for ensuring system reliability and reducing manual intervention. In this guide, you'll learn how to use systemd to create and manage a service that starts automatically on boot. We'll cover setting up a dedicated user for security, creating a service file, enabling the service, and troubleshooting common issues.

![alt text](image.png)

<!--truncate-->

Before getting started, it's recommended that you have a basic idea of what's actually going on by reading [this](https://wiki.archlinux.org/title/Systemd) awesome page on the Arch Wiki.

The command we want to run is:

```bash
/apps/myapp/executable
```

where `/apps/myapp` is the directory and `executable` is the name of the binary that we want to execute.


## Preparations

### Using your user account (Not Recommended)

If you're running the service using your existing user account, follow these steps:

1. Get your username by running:

   ```bash
   id -un
   ```

2. Find your group name by running:

   ```bash
   id -gn
   ```

3. For detailed user and group information, run:

   ```bash
   id
   ```

   Example output:

   ```bash
   uid=1000(username) gid=1000(groupname) groups=1000(groupname),27(sudo),100(users)
   ```

   Here, `username` is your username, and `groupname` after `gid=` is your primary group name.


### Creating a Separate User and Group (Recommended)

For better security, it's recommended to create a separate user and group to run the service. This ensures the service is isolated from your main user account.

To create a new user and group:

1. Create a new group:

   ```bash
   sudo groupadd servicegroup
   ```

2. Create a new user with no login shell and assign it to the group:

   ```bash
   sudo useradd -r -s /usr/sbin/nologin -g servicegroup serviceuser
   ```

   - `-r`: Creates a system user.
   - `-s /usr/sbin/nologin`: Ensures the user cannot log in.
   - `-g servicegroup`: Assigns the user to the specified group.

3. Ensure the user and group have the necessary permissions for the application directory:

   ```bash
   sudo chown -R serviceuser:servicegroup /apps/myapp
   ```

Ensure that the user running the service has the necessary permissions to access the application directory and any configuration files or resources it depends on.

## Creating a Systemd Service File

1. Create a systemd service file:

   ```bash
   sudo nano /etc/systemd/system/myapp.service
   ```

   Replace `myapp` with the desired name for the service.

2. Add the following content:

   ```ini
   [Unit]
   Description=MyApp Service
   After=network.target

   [Service]
   ExecStart=/apps/myapp/executable args --config arg2
   WorkingDirectory=/apps/myapp
   Restart=always
   User=serviceuser
   Group=servicegroup

   [Install]
   WantedBy=multi-user.target
   ```

   Replace the following placeholders:
   - `ExecStart`: Full path to your executable with any required arguments.
   - `WorkingDirectory`: Directory where your application resides.
   - `User`: The user running the service.
   - `Group`: The group running the service.
   - For more details, refer to the [systemd.service documentation](https://man.archlinux.org/man/systemd.service.5#OPTIONS)'s OPTIONS section.


3. Save and close the file.

## Enabling and Starting the Service

1. Reload systemd to recognize the new service:

   ```bash
   sudo systemctl daemon-reload
   ```

2. Enable the service to start on boot:

   ```bash
   sudo systemctl enable myapp
   ```

3. Start the service immediately:

   ```bash
   sudo systemctl start myapp
   ```

4. Verify the service is running:

   ```bash
   sudo systemctl status myapp
   ```

## Viewing Logs

To view logs for the service in real-time, run:

```bash
journalctl -u myapp -f
```

Make sure to test the service thoroughly to confirm it behaves as expected both during manual starts and after a system reboot.
