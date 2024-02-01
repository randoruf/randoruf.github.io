---
layout: post
title: "运行 Bash 脚本"
date: 2021-01-05T00:20:00Z
tags: [linux]
---

假设一个 `bash_script` 为

```bash
echo "Hello World"
```

要在 Linux 运行

```bash
$sudo bash
```

进入 Bash Shell 后, 运行 脚本文件

```bash
bash ./bash_script
```

这样大概就可以运行 Bash 文件了。



```bash
#!/usr/bin/bash
echo "You will now be running the FITVM configuration script"
echo "This can take 30 mins or more to to complete."
echo #

read  -n1 -p "Are you sure you want to do that? (Y to say Yes, anyother key quits) " REPLY
echo    #

if [[ ! "$REPLY" =~ ^([yY][eE][sS]|[yY])$ ]]
then
	echo #
	echo "Script cancelled"
    exit 1
fi
echo #
echo "OK, We are doing it. Be patient"

sleep 2


apt-get -y update

apt-get -y  install gcc
apt-get -y  install binutils
apt-get -y  install tightvncserver
apt-get -y  install xrdp
apt-get -y  install htop
apt-get -y  install netdata-core
apt-get -y  install pluma

apt-get -y  install ghex
apt-get -y  install xxgdb
apt-get -y  install ddd
apt-get -y  install neimver
apt-get -y  install openmpi-bin
apt-get -y  install iperf
apt-get -y  install sockperf
apt-get -y  install nttcp
apt-get -y  install gnuplot-x11
apt-get -y  install gnuplot-qt

apt-get -y  install logisim
apt-get -y  install xspim
apt-get -y  install wireshark-qt
apt-get -y  install openjdk-14-jdk

snap install eclipse --classic

rm -f download
wget https://sourceforge.net/projects/spimsimulator/files/qtspim_9.1.22_linux64.deb/download
mv download qtspim.deb
dpkg -i qtspim*.deb

rm -rf /opt/mars
wget https://courses.missouristate.edu/KenVollmar/mars/MARS_4_5_Aug2014/Mars4_5.jar
mkdir /opt/mars
cp Mars4* /opt/mars
echo java -jar /opt/mars/Mars4_5.jar > /home/osboxes/run-mars
chmod a+x /home/osboxes/run-mars
rm ./Mars*

wget https://www.realvnc.com/download/file/viewer.files/VNC-Viewer-6.20.529-Linux-x64.deb
dpkg -i VNC*.deb

wget https://zoom.us/client/latest/zoom_amd64.deb
dpkg -i zoom*.deb

apt -y --fix-broken install
```

