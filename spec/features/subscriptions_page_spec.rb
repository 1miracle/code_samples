# frozen_string_literal: true

require "rails_helper"
RSpec.describe "Users page", :devise do
  let!(:currency) { create(:currency, :dollar) }
  let(:data_center) { create(:data_center, :with_provider) }
  let(:company) { data_center.companies.first }
  let(:vendor) { create(:vendor, :with_cpq_subscription, :with_partner_subscription, company: company) }
  let(:vendor_without_subscription) { create(:vendor) }

  before do
    create(:white_label, default: true)
    create(:subdomain, name: "first-company", company: company, verified: true)
    sub_1 = create(:subscription, :single_provider_white_label_product, company: company, status: :paid)
    create(:white_label, company: company, subscription: sub_1, default_color: "#7c0080")
  end

  it "Access Subscriptions page", js: true do
    vendor_signin(vendor.email, vendor.password)
    wait_hidden_loading_section
    expect(page).to have_current_path(vendor_dashboard_path)
    click_link "Subscriptions"
    expect(page).to have_current_path(vendor_subscriptions_path)
    expect(page).to have_content "Manage Subscriptions"
    expect(page).to have_selector ".company-vendor.row", count: 4

    all("button.edit-vendor-button")[0].click
    find("input[type='checkbox'] + label").click
    click_button "Close Settings"

    all("button.edit-vendor-button")[3].click
    find_field(with: "", match: :first).set("First Company")
    find_field(with: "#7c0080", match: :first).set("#0fb92a")
    find_field(with: "", match: :first).set("first-company.exom.com")
    click_button "Close Settings"
  end

  it "Without subscriptions", js: true do
    vendor_signin(vendor_without_subscription.email, vendor_without_subscription.password)
    wait_hidden_loading_section
    expect(page).to have_current_path(vendor_dashboard_path)
    click_link "Subscriptions"
    expect(page).to have_current_path(vendor_subscriptions_path)
    expect(page).to have_content "Manage Subscriptions"
    expect(page).to have_content "(You Have No Current Subscriptions)"
    expect(page).to have_selector ".company-vendor.row", count: 1
  end

  it "Redirect to dashboard", js: true do
    vendor_without_subscription.sales!
    vendor_signin(vendor_without_subscription.email, vendor_without_subscription.password)
    wait_hidden_loading_section
    expect(page).to have_current_path(vendor_dashboard_path)
    expect(page).to_not have_link "Subscriptions"
    visit vendor_subscriptions_path
    expect(page).to have_current_path(vendor_dashboard_path)
  end
end
