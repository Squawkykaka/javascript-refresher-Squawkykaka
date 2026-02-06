{
  pkgs ? import <nixpkgs> {},
}:
{
  default = pkgs.callPackage ./package.nix { };
  fontcull = pkgs.callPackage ./fontcull.nix { };
}
