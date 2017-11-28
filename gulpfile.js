var gulp = require("gulp");
var sonarqubeScanner = require("sonarqube-scanner");

gulp.task("default", function(callback) {
  sonarqubeScanner(
    {
      serverUrl: "https://sonarcloud.io",
      token: "b8c8270f28cb092a118b634f39e046f026ee0a04",
      options: {
        "sonar.organization": "pulento-github",
        "sonar.javascript.lcov.reportPaths": "client/coverage/lcov.info",
        "sonar.exclusions": "**/coverage/**, **/build/**",
        "sonar.coverage.exclusions":
          "**/tests/**, **/routes/**, index.js, gulpfile.js, config.js"
      }
    },
    callback
  );
});
