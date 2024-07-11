pipeline {
  agent {
      label 'python311 && amd64'
  }
  options {
    disableConcurrentBuilds()
  }

  tools {nodejs "Node 20"}

  stages {
    stage('Install Python Virtual Enviroment') {
      steps {
        sh 'python3.11 -m venv env'
      }
    }

    stage('Install Application Dependencies') {
      steps {
        sh '''
          . env/bin/activate
          pip3.11 install --upgrade pip
          pip3.11 install -r requirements.txt
          corepack enable
          npm install
          deactivate
          '''
      }
    }

    stage('Build') {
      steps {
        sh 'npm run build'
      }
    }

    stage('Deploy if tagged') {
      when {
        tag pattern: '(\\d+\\.){3}', comparator: "REGEXP"
      }
      steps {
        s3Upload profileName: 'Irrsinn.net Buckets',
          userMetadata: [],
          dontWaitForConcurrentBuildCompletion: false,
          dontSetBuildResultOnFailure: false,
          pluginFailureResultConstraint: 'FAILURE',
          consoleLogLevel: 'INFO',
          entries: [[
            bucket: 'plex-watchlist',
            sourceFile:'dist/**',
            managedArtifacts: false,
            keepForever: true,
            noUploadOnFailure: true,
            selectedRegion: 'us-east-1'
          ]]
      }
    }

  }
  post {
    cleanup {
      cleanWs()
      dir("${env.WORKSPACE}@tmp") {
        deleteDir()
      }
      dir("${env.WORKSPACE}@2") {
        deleteDir()
      }
      dir("${env.WORKSPACE}@2@tmp") {
        deleteDir()
      }
    }
  }
}
