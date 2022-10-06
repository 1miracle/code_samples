# frozen_string_literal: true

class Api::V1::ConfirmationsController < Api::V1::ApiController
  def show
    render json: current_user.confirmed?, status: :ok
  end

  def create
    create_confirmation_cmd = Commands::CreateConfirmationCommand.new(white_label: @white_label,
                                                                      current_user: current_user)
    if create_confirmation_cmd.execute
      render json: create_confirmation_cmd.results, status: :ok
    else
      render json: create_confirmation_cmd.errors, status: :unprocessable_entity
    end
  end
end
