{ pkgs ? import <nixpkgs> {} }:

let
  packages = import ./default.nix { inherit pkgs; };
in

pkgs.mkShell {
  packages = [
    pkgs.bun
    packages.fontcull
  ];

  buildInputs = [
    pkgs.vips
    pkgs.gcc.cc.lib
  ];

  LD_LIBRARY_PATH = "${pkgs.gcc.cc.lib}/lib";
}
