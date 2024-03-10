FROM ruby:3.2.2

RUN groupadd --system app-user && adduser --system --ingroup app-user app-user

WORKDIR /app

RUN chown app-user:app-user /app

COPY Gemfile Gemfile.lock ./

ENV BUNDLER_VERSION 2.4.10
RUN gem update --system \
    && gem install bundler -v $BUNDLER_VERSION \
    && bundle config set without 'development test' \
    && bundle install

COPY --chown=app-user:app-user . ./

CMD ["puma", "config.ru", "-C", "puma.rb"]
