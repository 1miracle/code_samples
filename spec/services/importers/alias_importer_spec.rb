require "rails_helper"

RSpec.describe Importers::AliasImporter do
  let(:company_name) { "TEST" }
  let(:company) { create(:company, id: 5, name: company_name) }

  let(:data) do
    {
      id: company.id,
      name: company.name,
      vendor_name: company.name,
      incoming_1: company_name
    }
  end

  describe ".process_row!" do
    context "inseting a new record" do
      it "inserts new record" do
        expect { described_class.process_row!(data) }.to(change { Alias.count }.by(1))
        first_alias = Alias.first
        expect([first_alias.name, first_alias.aliasable_id, first_alias.aliasable_type]).to eq([company_name,
                                                                                                company.id,
                                                                                                "Company"])
      end
    end
  end
end
