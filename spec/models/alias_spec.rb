# frozen_string_literal: true

require "rails_helper"

RSpec.describe Alias, type: :model do
  let!(:company) { create(:company) }
  let(:alias) { create(:alias, aliasable_id: company) }

  subject { build(:alias, aliasable_id: company.id) }

  it { is_expected.to belong_to :aliasable }
  it { is_expected.to validate_presence_of(:aliasable_id) }
  it { is_expected.to validate_presence_of(:name) }
  it { is_expected.to validate_presence_of(:aliasable_type) }
end
