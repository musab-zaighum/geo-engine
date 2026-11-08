# Edit this configuration file to define what should be installed on
# your system. Help is available in the configuration.nix(5) man page, on
# https://search.nixos.org/options and in the NixOS manual (`nixos-help`).

{ config, lib, pkgs, ... }:

{
  imports =
    [ # Include the results of the hardware scan.
      ./hardware-configuration.nix
    ];

  # Use the GRUB 2 boot loader.
  boot.loader.grub.enable = true;
  boot.loader.grub.device = "/dev/vda"; # or "nodev" for efi only

  networking.hostName = "nixos-vps"; # Define your hostname.

  # Configure network connections interactively with nmcli or nmtui.
  networking.networkmanager.enable = true;

  services.qemuGuest.enable = true;
  swapDevices = [
    {
      device = "/swapfile";
      size = 2048;
    }
  ];

  services.netbird.enable = true;
  services.netbird.useRoutingFeatures = "both";
  services.resolved.enable = true;

  boot.kernelModules = [ "tcp_bbr" ];

  boot.kernel.sysctl = {
    # 1. Enable BBR and Fair Queueing
    "net.core.default_qdisc" = "fq";
    "net.ipv4.tcp_congestion_control" = "bbr";

    # 2. Kernel IP Forwarding for Exit Node routing
    "net.ipv4.ip_forward" = 1;
    "net.ipv6.conf.all.forwarding" = 1;

    # 3. Relax Reverse Path Filtering (prevents dropped asymmetric packets)
    "net.ipv4.conf.all.rp_filter" = 2;
    "net.ipv4.conf.default.rp_filter" = 2;

    # 4. Expand TCP Buffer Windows (scales for high bandwidth x latency products)
    "net.core.rmem_max" = 16777216;
    "net.core.wmem_max" = 16777216;
    "net.ipv4.tcp_rmem" = "4096 87380 16777216";
    "net.ipv4.tcp_wmem" = "4096 65536 16777216";
    "net.core.netdev_max_backlog" = 10000;

    # 5. Disable TCP Slow Start after idle (maintains throughput across pauses)
    "net.ipv4.tcp_slow_start_after_idle" = 0;
  };

  # 6. Clamp TCP MSS to MTU (prevents WireGuard packet fragmentation bottlenecks)
  networking.firewall.extraCommands = ''
    iptables -t mangle -A FORWARD -p tcp --tcp-flags SYN,RST SYN -j TCPMSS --clamp-mss-to-pmtu
  '';

  services.openssh = {
    enable = true;
    openFirewall = false;
    settings = {
      PasswordAuthentication = true;
      PermitRootLogin = "no";
      MaxAuthTries = 3;
      LoginGraceTime = "30s";
    };
  };

  users.users.pwn = {
    isNormalUser = true;
    extraGroups = [ "wheel" ];
    packages = with pkgs; [
      tree
    ];
    openssh.authorizedKeys.keys = [
      "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIDqxjtaVSqvyvVJQZ6vBXM0n7JtpRteb3cp62fnvIYWF pwn@nixos"
      "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIEykOFs4DpVkaiWMERysH0AhTzh4wzH6NB5NarSeJDGj pwn@nixos"
      "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIN+so6fPILjKmyoQB8Igu+ZLw81BAsit8oiWSrK5Axl1 disktech3d@gmail.com"
    ];
  };

  environment.systemPackages = with pkgs; [
    git
    nodejs
    caddy
    curl
    htop
    vim
  ];

  networking.firewall = {
    enable = true;
    trustedInterfaces = [ "wt0" ];
    allowedTCPPorts = [ 22 80 443 ];
  };

  # NexusRank1 Next.js Application Service
  systemd.services.nexusrank1 = {
    description = "NexusRank1 Next.js Application";
    after = [ "network.target" ];
    wantedBy = [ "multi-user.target" ];
    serviceConfig = {
      Type = "simple";
      User = "pwn";
      Group = "users";
      WorkingDirectory = "/var/www/nexusrank1";
      ExecStart = "${pkgs.nodejs}/bin/node server.js";
      Restart = "always";
      RestartSec = 5;
      Environment = [
        "PORT=3000"
        "HOSTNAME=127.0.0.1"
        "NODE_ENV=production"
      ];
    };
  };

  # Caddy Reverse Proxy for nexusrank1.com and Direct IP Access
  services.caddy = {
    enable = true;
    virtualHosts."nexusrank1.com" = {
      serverAliases = [ "www.nexusrank1.com" ];
      extraConfig = ''
        reverse_proxy 127.0.0.1:3000
      '';
    };
    virtualHosts."http://139.180.143.95" = {
      extraConfig = ''
        reverse_proxy 127.0.0.1:3000
      '';
    };
    virtualHosts."http://100.95.222.87" = {
      extraConfig = ''
        reverse_proxy 127.0.0.1:3000
      '';
    };
  };

  system.stateVersion = "26.05";
}
