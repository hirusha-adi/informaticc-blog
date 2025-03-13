---
title: Setting Up Wacom Tablets on Linux - A Complete Guide
authors: [hirusha]
tags: [linux,wacom,tutorials]
---

This guide explains how to set up and configure Wacom tablets on Linux (tested with Pop!_OS with KDE), including verifying drivers, mapping tablets to monitors, troubleshooting common issues, and automating the setup process.

![alt text](image.png)

<!--truncate-->

## Introduction

This guide is written for Pop OS. This guide will continue assuming that you have installed the required Wacom drivers. There are the packages installed in my PopOS installation with KDE as my default desktop environment:

- `libwacom-bin/jammy,now 2.2.0-1 amd64 [installed,automatic]`
- `libwacom-common/jammy,jammy,now 2.2.0-1 all [installed,automatic]`
- `libwacom9/jammy,now 2.2.0-1 amd64 [installed,automatic]`
- `xserver-xorg-input-wacom/jammy,now 1:1.0.0-3ubuntu1 amd64 [installed,automatic]`

To ensure that the required drivers are installed, run the following command:

```bash
sudo dmesg | grep -i "wacom"
```

This will get the message buffer of the kernel (the kernel ring buffer) and display only the lines that mentions "wacom" with case ignored. You should see a similar output like this:

```bash
> sudo dmesg | grep -i "wacom"

[    5.814843] usb 1-6: Manufacturer: Wacom Co.,Ltd.
[    6.080476] input: Wacom Co.,Ltd. Intuos5 touch M Mouse as /devices/pci0000:00/0000:00:14.0/usb1/1-6/1-6:1.0/0003:056A:0027.0002/input/input4
[    6.080952] hid-generic 0003:056A:0027.0002: input,hidraw1: USB HID v1.10 Mouse [Wacom Co.,Ltd. Intuos5 touch M] on usb-0000:00:14.0-6/input0
[    6.081372] hid-generic 0003:056A:0027.0003: hiddev0,hidraw2: USB HID v1.10 Device [Wacom Co.,Ltd. Intuos5 touch M] on usb-0000:00:14.0-6/input1
[    6.580882] wacom 0003:056A:0027.0002: hidraw1: USB HID v1.10 Mouse [Wacom Co.,Ltd. Intuos5 touch M] on usb-0000:00:14.0-6/input0
[    6.580918] input: Wacom Intuos5 touch M Pen as /devices/pci0000:00/0000:00:14.0/usb1/1-6/1-6:1.0/0003:056A:0027.0002/input/input9
[    6.580980] input: Wacom Intuos5 touch M Pad as /devices/pci0000:00/0000:00:14.0/usb1/1-6/1-6:1.0/0003:056A:0027.0002/input/input11
[    6.581187] wacom 0003:056A:0027.0003: hidraw2: USB HID v1.10 Device [Wacom Co.,Ltd. Intuos5 touch M] on usb-0000:00:14.0-6/input1
[    6.581208] input: Wacom Intuos5 touch M Finger as /devices/pci0000:00/0000:00:14.0/usb1/1-6/1-6:1.1/0003:056A:0027.0003/input/input13
```

If you do not see anything, something might be wrong.

## Normal Installation

### Verify Installation

First, plug in the device and then lets list all of the devices identified by the driver. To do that, run this command:

```bash
xsetwacom list devices
```

It will show you something like this:

```bash
> xsetwacom list devices

Wacom Intuos5 touch M Pad pad           id: 10  type: PAD       
Wacom Intuos5 touch M Pen stylus        id: 11  type: STYLUS    
Wacom Intuos5 touch M Finger touch      id: 12  type: TOUCH     
Wacom Intuos5 touch M Pen eraser        id: 17  type: ERASER    
Wacom Intuos5 touch M Pen cursor        id: 18  type: CURSOR 
```

If you are using a single monitor, you should be good to go.

### Mapping Monitors

If you are using multiple monitors, you may want to map the tablet to a single monitor.

In this case, you have to list all the monitors you have and identify the monitor that you want to map the wacom tablet to. To do that, run this command:

```bash
xrandr --listactivemonitors
```

This command will only list the active monitors.

Then, you should see something like this:

```bash
> xrandr --listactivemonitors

Monitors: 3
 0: +*HDMI-0 1920/518x1200/324+1920+0  HDMI-0
 1: +DP-0 1920/510x1080/290+0+60  DP-0
 2: +DVI-D-0 1920/518x1200/324+3840+0  DVI-D-0
```

In my case, the above output shows that I have 3 monitors, and I want to map my wacom tablet to the monitor with ID `0` (the monitor connected to the `HDMI-0` port).

Top map an identified wacom device to a monitor, the command that should be used is:

```bash
xsetwacom --set "<ID_of_device>" MapToOutput "<Monitor>"
```

Note that we should run this command for all the devices listed from the `xsetwacom --list devices` command.

If you are using an Nvidia graphics card, please refer to [this section](#using-nvidia-graphics-cards) for more information.

So, mapping all the listed wacom devices to monitor connected to the `HDMI-0` port, the commands that should be used are:

```bash
xsetwacom --set "10" MapToOutput "HDMI-0"
xsetwacom --set "11" MapToOutput "HDMI-0"
xsetwacom --set "12" MapToOutput "HDMI-0"
xsetwacom --set "17" MapToOutput "HDMI-0"
xsetwacom --set "18" MapToOutput "HDMI-0"
```

Where, the first command meansm, map the wacom device with ID: `10` to the monitor connected via the `HDMI-0` port.

### Issues

If you did everything correctly, but you get an error like this:

```bash
> xsetwacom --set "10" MapToOutput "HDMI-0"

Unable to find an output 'HDMI-0'
```

Try running the command but with the `-v` flag to make it more verbose to see whats actually going on.

```bash
xsetwacom -v --set "10" MapToOutput "HDMI-0"
```

For example, if you are using an Nvidia graphics card, you should see soemthing like this:

```bash
> xsetwacom -v --set "10" MapToOutput "HDMI-0"

... Display is '(null)'.
... 'set' requested for '10'.
... Checking device 'Virtual core pointer' (2).
... Checking device 'Virtual core keyboard' (3).
... Checking device 'Virtual core XTEST pointer' (4).
... Checking device 'Virtual core XTEST keyboard' (5).
... Checking device 'Power Button' (6).
... Checking device 'Power Button' (7).
... Checking device 'Sleep Button' (8).
... Checking device 'PixA琀 USB Optical Mouse' (9).
... Checking device 'Wacom Intuos5 touch M Pad pad' (10).
... Checking device 'Wacom Intuos5 touch M Pen stylus' (11).
... Checking device 'Wacom Intuos5 touch M Finger touch' (12).
... Checking device 'SEMICO USB Keyboard' (13).
... Checking device 'SEMICO USB Keyboard Consumer Control' (14).
... Checking device 'SEMICO USB Keyboard System Control' (15).
... Checking device 'Eee PC WMI hotkeys' (16).
... Checking device 'Wacom Intuos5 touch M Pen eraser' (17).
... Checking device 'Wacom Intuos5 touch M Pen cursor' (18).
... Checking device 'SEMICO USB Keyboard Consumer Control' (19).
... Device 'Wacom Intuos5 touch M Pad pad' (10) found.
... RandR extension not found, too old, or NV-CONTROL extension is also present.
Unable to find an output 'HDMI-0'.
```

You should re-check the information about the monitor and the ID of the wacom device that you passed in. If this issue still persists, try following [this](#using-nvidia-graphics-cards) section.

## Using NVIDIA Graphics Cards

You should follow everything said above except for running the `xsetwacom --set` command as it will be slighly different.

Referring back to these commands:

```
xsetwacom list devices
```

That outputs this:

```bash
> xsetwacom list devices

Wacom Intuos5 touch M Pad pad           id: 10  type: PAD       
Wacom Intuos5 touch M Pen stylus        id: 11  type: STYLUS    
Wacom Intuos5 touch M Finger touch      id: 12  type: TOUCH     
Wacom Intuos5 touch M Pen eraser        id: 17  type: ERASER    
Wacom Intuos5 touch M Pen cursor        id: 18  type: CURSOR 
```

and

```
xrandr --listactivemonitors
```

That outputs this:
```bash
> xrandr --listactivemonitors

Monitors: 3
 0: +*HDMI-0 1920/518x1200/324+1920+0  HDMI-0
 1: +DP-0 1920/510x1080/290+0+60  DP-0
 2: +DVI-D-0 1920/518x1200/324+3840+0  DVI-D-0
```

Top map an identified wacom device to a monitor, the command that should be used is:

```bash
xsetwacom --set "<ID_of_device>" MapToOutput "<Monitor>"
```

But, instead of using `HDMI-0`, we will be replaceing `<Monitor>` with something in this format:

```
HEAD_<ID_of_monitor>
```

So, in my case, since I'm mapping my wacom tablet to my monitor with ID: `0`, what I should pass in as `<Monitor>` is `"HEAD-0"`

The commands that I should run are:

```
xsetwacom --set "10" MapToOutput "HEAD-0"
xsetwacom --set "11" MapToOutput "HEAD-0"
xsetwacom --set "12" MapToOutput "HEAD-0"
xsetwacom --set "17" MapToOutput "HEAD-0"
xsetwacom --set "18" MapToOutput "HEAD-0"
```

Where the first command means, map the wacom tablet with ID: `10` to the monitor with ID: `0` (which by referring to the `xrandr --listactivemonitors` can verified is the monitor connected via the `HDMI-0` port)


## Automating this

### Script 

This script can be found in this [github repository](https://github.com/hirusha-adi/easy-wacom-linux)

```bash
#!/bin/bash

# when incorrect usage
if [ "$#" -ne 1 ]; then
    echo "Usage: $0 <monitor-name>"
    echo "Refer 'https://hirusha.xyz/docs/linux/wacom-tablets' for more information"
    exit 1
fi

monitor_name=$1

# get wacom device ids
device_ids=$(xsetwacom list devices | grep -o 'id: [0-9]*' | awk '{ print $2 }')

# set
for id in $device_ids; do
    echo xsetwacom --set $id MapToOutput $monitor_name
    xsetwacom --set $id MapToOutput $monitor_name
done
```

<details>
<summary>How it works? - generated with ChatGPT</summary>

The script performs the following tasks:

1. **Checks for Incorrect Usage:**
   - It ensures that the script is run with exactly one argument. 
   - If not, it displays a usage message and a reference URL for more information, then exits with a status code of 1.

2. **Assigns the First Argument to `monitor_name`:**
   - The first argument passed to the script is stored in the variable `monitor_name`.

3. **Gets Wacom Device IDs:**
   - It retrieves the list of Wacom devices connected to the system using the `xsetwacom list devices` command.
   - It then extracts the numerical device IDs using `grep` and `awk`.

4. **Maps Each Wacom Device to the Specified Monitor:**
   - It loops through each extracted device ID.
   - For each device ID, it prints the command that maps the Wacom device to the specified monitor (`xsetwacom --set $id MapToOutput $monitor_name`).
   - It then actually runs the command to map the Wacom device to the specified monitor.

In summary, the script:
- Validates the input.
- Retrieves Wacom device IDs.
- Maps each Wacom device to the specified monitor by running the appropriate `xsetwacom` command for each device.

</details>
 

### Usage

First, download this script, it will be saved to `map-monitor.sh` in the current working directory.

```bash
curl -o "map-monitor.sh" "https://raw.githubusercontent.com/hirusha-adi/easy-wacom-linux/main/map-monitor.sh"
```

Then, make it executable

```bash
chmod +x map-monitor.sh
```

Usage of the script:

```bash
./map-monitor.sh <Monitor>
```

where `<Monitor>` is the same argument that you would have passed in to the `xsetwacom --set` command when doing in manually.

Example usage:

```bash
# normal
./map-monitor.sh HDMI-0

# with nvidia cards
./map-monitor.sh HEAD-0
```

## Run at Startup

This is NOT recommended, but if you really want this, just proceed.

### Basic Setup

Create a bash script `map_wacom_devices.sh` at `/usr/local/bin/` with the required commands.

Create the file:
```
sudo nano /usr/local/bin/map_wacom_devices.sh
```

Exmaple contents of the file:

```bash
#!/bin/bash

# Map Wacom devices to the specified monitor
xsetwacom --set "10" MapToOutput "HEAD-0"
xsetwacom --set "11" MapToOutput "HEAD-0"
xsetwacom --set "12" MapToOutput "HEAD-0"
xsetwacom --set "17" MapToOutput "HEAD-0"
xsetwacom --set "18" MapToOutput "HEAD-0"
```

Make it executable:

```
sudo chmod +x /usr/local/bin/map_wacom_devices.sh
```

### as a Systemd Service

Create a Systemd Service file:

```
nano /etc/systemd/system/map_wacom_devices.service
```

with the contents of the service file being:

```ini
[Unit]
Description=Map Wacom Devices to Monitor
After=graphical.target

[Service]
Type=oneshot
ExecStart=/usr/local/bin/map_wacom_devices.sh

[Install]
WantedBy=default.target
```

After all this, you can enable and start the service:

```
sudo systemctl enable --now map_wacom_devices.service
```

### as a Cron Job

Open the crontab editor

```bash
sudo crontab -e
```

Add this line to the crontab to run the above script at reboot

```
@reboot /usr/local/bin/map_wacom_devices.sh
```

You can now save and exit the editor, it will be affective from the next startup onwards.

To verify if the cronjob was added successfully, run this command:

```
sudo crontab -l
```


## References

- https://forums.linuxmint.com/viewtopic.php?t=370190
- https://stackoverflow.com/questions/69255896/xsetwacom-unable-to-find-output
- https://www.youtube.com/watch?v=dzplf-0RJDE
