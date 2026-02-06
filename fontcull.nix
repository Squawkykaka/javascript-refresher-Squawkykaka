{rustPlatform, fetchFromGitHub}: rustPlatform.buildRustPackage (finalAttrs:{
  pname = "fontcull";
  version = "1.0.6";

  src = fetchFromGitHub {
    owner = "bearcove";
    repo = "fontcull";
    tag = "fontcull-cli-v${finalAttrs.version}";
    hash = "sha256-bf3uTLRlW+LXo55ipPMYSndkDSY/I/bvuboYHuF7Ta8=";
  };

  cargoHash = "sha256-7bs0nulKVq0m0Z9BAvRo2GgTwERFP00hPYjihMQQMfU=";
})
