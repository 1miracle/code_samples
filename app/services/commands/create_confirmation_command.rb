# frozen_string_literal: true

class Commands::CreateConfirmationCommand
  attr_reader :results, :errors, :current_user

  def initialize(white_label:, current_user:)
    @errors = []
    @white_label = white_label
    @current_user = current_user
  end

  def execute
    return false unless current_user_present?

    current_user.current_white_label_id = @white_label&.id
    email_verification = EmailVerification.find_or_create_by(email: current_user.email)
    email_verification.update(token: email_verification.token.presence || SecureRandom.uuid)
    ProjectMailer.send_email_with_verification(email_verification, @white_label).deliver
    @results = { message: :sent }
    true
  end

  private

  def current_user_present?
    if current_user
      true
    else
      errors.push({ message: "Not logged in" })
      false
    end
  end
end
