nodehook
=======

### Installation

Not done
```bash
> npm install -g nodehook
> cd /nodehook/directory
> nodehook init
> nodehook new config
> vi something
> nodehook start
```

# add upstarted instructions

### Web interface

# Configure a password
# Autorestart nodehook on a push on itself
# socket.io output for a script

### Config

Configuration requires 3 properties, the name of the repository, branch, script to run and user to run the script as.

Note: nodehook does a sudo to run the script and requires the following config in /etc/sudoers:

# Assuming you have create a user named 'deploy' to run nodehook as:

# Deploy user can run commands as any other user
deploy ALL=(ALL)	NOPASSWD: ALL

# Do not require a tty for deploy user
Defaults:deploy    !requiretty

### Note

Ensure that the script you want to run has execute rights (`> chmod a+x my-deploy-script.sh`)
