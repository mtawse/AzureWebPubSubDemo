# frozen_string_literal: true

require 'http'
require 'jwt'

# Azure pubsub client
class PubSub
  SERVER_DOMAIN = ENV.fetch('PUBSUB_DOMAIN')
  WEB_URL = "https://#{SERVER_DOMAIN}"
  SOCKET_URL = "wss://#{SERVER_DOMAIN}"
  SECRET = ENV.fetch('PUBSUB_SECRET')

  def initialize(user_id, hub)
    @user_id = user_id
    @hub = hub
  end

  def connection_url
    path = "/client/hubs/#{@hub}"
    url = "#{WEB_URL}#{path}"
    "#{SOCKET_URL}#{path}?access_token=#{access_token(url)}"
  end

  def send_mmessage(message)
    path = "/api/hubs/#{@hub}/users/#{@user_id}/:send"
    url = "#{WEB_URL}#{path}"
    message = { message: message, id: SecureRandom.uuid }.to_json
    bearer = access_token(url)
    HTTP.auth("Bearer #{bearer}").post(url, body: message)
  end

  def access_token(url)
    params = { aud: url, exp: (Time.now + (8 * 60 * 60)).to_i, sub: @user_id }
    JWT.encode(params, SECRET, 'HS256', { typ: 'JWT' })
  end
end
