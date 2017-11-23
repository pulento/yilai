var gulp = require("gulp");
var sonarqubeScanner = require("sonarqube-scanner");

gulp.task("default", function(callback) {
  sonarqubeScanner(
    {
      serverUrl: "https://sonarcloud.io",
      token: "b8c8270f28cb092a118b634f39e046f026ee0a04",
      options: {
        "sonar.organization": "pulento-github"
      }
    },
    callback
  );
});
