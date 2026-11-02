#!/bin/sh

#
# Copyright © 2015-2021 the original authors.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#      https://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#

# Attempt to set APP_HOME

# Resolve links: $0 may be a link
app_path=$0

# Need this for relative symlinks.
while [ -h "$app_path" ]; do
    ls=`ls -ld "$app_path"`
    link=`expr "$ls" : '.*-> \(.*\)$'`
    if expr "$link" : '/.*' > /dev/null; then
        app_path="$link"
    else
        app_path=`dirname "$app_path"`"/$link"
    fi
done

APP_HOME=`dirname "$app_path"`

# Absolute path
APP_HOME=`cd "$APP_HOME" && pwd`

APP_NAME="Gradle"
APP_BASE_NAME=`basename "$0"`

# Add default JVM options here. You can also use JAVA_OPTS and GRADLE_OPTS to pass JVM options to this script.
DEFAULT_JVM_OPTS='"-Xmx64m" "-Xms64m"'

# Use the maximum available, or set MAX_FD != -1 to use that value.
MAX_FD="maximum"

warn () {
    echo "$*"
} >&2

die () {
    echo
    echo "$*"
    echo
    exit 1
} >&2

# OS specific support (both adapted from Apache Ant interfaces)
darwin=false
cygwin=false
msys=false
nonstop=false
case "`uname`" in
  DARWIN* )
    darwin=true
    ;;
  CYGWIN* )
    cygwin=true
    ;;
  MINGW* )
    msys=true
    ;;
  NONSTOP* )
    nonstop=true
    ;;
esac

CLASSPATH=$APP_HOME/gradle/wrapper/gradle-wrapper.jar

# Determine the Java command to use to start the JVM.
if [ -n "$JAVA_HOME" ] ; then
    if [ -x "$JAVA_HOME/jre/sh/java" ] ; then
        # IBM's JDK on AIX uses strange locations for the executables
        JAVACMD="$JAVA_HOME/jre/sh/java"
    else
        JAVACMD="$JAVA_HOME/bin/java"
    fi
    if [ ! -x "$JAVACMD" ] ; then
        die "ERROR: JAVA_HOME is set to an invalid directory: $JAVA_HOME

Please set the JAVA_HOME variable in your environment to match the
location of your Java installation."
    fi
else
    JAVACMD="java"
    which java >/dev/null 2>&1 || die "ERROR: JAVA_HOME is not set and no 'java' command could be found in your PATH.

Please set the JAVA_HOME variable in your environment to match the
location of your Java installation."
fi

# Increase the maximum file descriptors if we can.
if [ "$cygwin" = "false" -a "$darwin" = "false" -a "$nonstop" = "false" ] ; then
    case $MAX_FD in #(
      max*)
        MAX_FD="`ulimit -H -n`" ||
            warn "Could not query maximum file descriptor limit: $MAX_FD"
        ;;
    esac
    case $MAX_FD in #(
      '' | inherit)
        # default to inherited limit
        ;;
      *)
        ulimit -n $MAX_FD ||
            warn "Could not set maximum file descriptor limit: $MAX_FD"
        ;;
    esac
fi

# Collect all arguments for the java command, following the shell quoting and substitution
# rules, and also do the same for the GRADLE_USER_HOME, TMPDIR and GRADLE_OPTS.

STARTS_WITH_MINUS=0
for i in "$@"; do
    if [ $STARTS_WITH_MINUS -eq 1 ]; then
        break
    fi
    case $i in
        -*) STARTS_WITH_MINUS=1 ;;
    esac
done

if [ ! -e "$APP_HOME/gradle/wrapper/gradle-wrapper.jar" ]; then
    # Fetch gradle wrapper jar if missing
    mkdir -p "$APP_HOME/gradle/wrapper"
    echo "Downloading Gradle Wrapper Jar..."
    curl -sLo "$APP_HOME/gradle/wrapper/gradle-wrapper.jar" https://raw.githubusercontent.com/gradle/gradle/v8.5.0/gradle/wrapper/gradle-wrapper.jar || true
fi

# Split up the JVM_OPTS And GRADLE_OPTS by spaces, but keep quoted values
eval "set -- $DEFAULT_JVM_OPTS $JAVA_OPTS $GRADLE_OPTS -Dorg.gradle.appname=$APP_BASE_NAME -classpath \"$CLASSPATH\" org.gradle.wrapper.GradleWrapperMain \"\$@\""

exec "$JAVACMD" "$@"
