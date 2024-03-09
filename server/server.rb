# frozen_string_literal: true

require 'sinatra'
require_relative 'pubsub'

# server routes
class Server < Sinatra::Base
  HUB = ENV.fetch('PUBSUB_HUB', 'Demo_hub')

  before do
    response.headers['Access-Control-Allow-Origin'] = '*'
  end

  options '*' do
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, PATCH, DELETE, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'content-type,x-csrf-token,x-requested-with'

    200
  end

  get '/negotiate' do
    socket = PubSub.new(params[:id], HUB)
    conn_url = socket.connection_url
    { url: conn_url }.to_json
  end

  post '/send' do
    request.body.rewind
    data = JSON.parse(request.body.read, symbolize_names: true)
    socket = PubSub.new(params[:id], HUB)
    socket.send_mmessage(data[:message])
  end
end
