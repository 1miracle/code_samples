# frozen_string_literal: true

require "rails_helper"
RSpec.describe Api::V1::ConfirmationsController, type: :controller do
  before do
    create(:white_label, default: true)
  end

  let(:user) { create(:user) }

  before do
    allow(controller).to receive(:current_user).and_return(user)
  end

  describe "#show" do
    context "returns the correct info" do
      before do
        get :show,
            format: :json,
            params: { id: user.id },
            session: { session_id: "an id" }
      end
      it { expect(response.body).to eq("false") }
      it { expect(response).to be_ok }
    end
  end

  describe "#create" do
    context "email sent" do
      before do
        post :create,
             format: :json,
             session: { session_id: "an id" }
      end
      it { expect(response.body).to eq({ message: :sent }.to_json) }
      it { expect(response).to be_ok }
    end

    context "without current_user" do
      before do
        allow(controller).to receive(:current_user).and_return(nil)

        post :create,
             format: :json,
             session: { session_id: "an id" }
      end

      it { expect(response.body).to eq([{ message: "Not logged in" }].to_json) }
    end
  end
end
