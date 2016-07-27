FROM selenium/node-base:2.53.0
MAINTAINER Ulion <ulion2002@gmail.com>

USER root

#=========
# Opera Developer
#=========
RUN sh -c 'echo "deb http://deb.opera.com/opera-developer/ stable non-free" >> /etc/apt/sources.list.d/opera.list' \
  && sh -c 'wget -O - http://deb.opera.com/archive.key | apt-key add -' \
  && apt-get update -qq \
  && apt-get install -qqy opera-developer \
  && ln -s /usr/bin/opera-developer /usr/bin/opera

#========================
# Selenium Configuration
#========================
COPY config.json /opt/selenium/config.json

USER seluser
