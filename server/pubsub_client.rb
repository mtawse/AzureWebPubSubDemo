# frozen_string_literal: true

require 'http'
require 'jwt'

# Azure pubsub client
class PubSubClient
  SERVER_HOST = ENV.fetch('PUBSUB_HOST')
  WEB_URL = "https://#{SERVER_HOST}"
  SOCKET_URL = "wss://#{SERVER_HOST}"
  SECRET = ENV.fetch('PUBSUB_SECRET')
  HUB = ENV.fetch('PUBSUB_HUB', 'Demo_hub')

  def initialize(user_id)
    @user_id = user_id
  end

  def connection_url
    path = "/client/hubs/#{HUB}"
    url = "#{WEB_URL}#{path}"
    "#{SOCKET_URL}#{path}?access_token=#{access_token(url)}"
  end

  def send_mmessage(message)
    path = "/api/hubs/#{HUB}/users/#{@user_id}/:send"
    url = "#{WEB_URL}#{path}"
    body = { message: message, id: SecureRandom.uuid }.to_json
    bearer = access_token(url)
    HTTP.auth("Bearer #{bearer}").post(url, body: body)
  end

  def access_token(url)
    params = { aud: url, exp: (Time.now + (8 * 60 * 60)).to_i, sub: @user_id }
    JWT.encode(params, SECRET, 'HS256', { typ: 'JWT' })
  end
end
