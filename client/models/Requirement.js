import InterconnectionReq from "./InterconnectionReq";
import SpacePowerReq from "./SpacePowerReq";
import { reduce, uniq, some, map, includes, find, every, sortedUniq, uniqBy } from "lodash";
import { IsValidIpBandwidth } from "app/libs/numberUtils";
import { generateRackSpaceAndPowers } from "app/components/ModelsHelpers";

class Requirement {
  constructor(
    id,
    company_interconnections = [new InterconnectionReq()],
    rack_space_and_powers = [new SpacePowerReq()],
    colocation_options = [],
    certifications = [],
    load_ramps_array = [],
    show_load_ramps = false,
    advanced_load_ramp = false,
    phased_pricings_attributes = [],
    ip_bandwidths = [{}],
    cloned_from_id = null,
    active = true,
    lrp_columns=[],
    new_request
  ) {
    this.id = id;
    this.company_interconnections = company_interconnections;
    this.rack_space_and_powers = rack_space_and_powers;
    this.colocation_options = colocation_options;
    this.certifications = certifications;
    this.load_ramps_array = load_ramps_array;
    this.show_load_ramps = show_load_ramps;
    this.advanced_load_ramp = advanced_load_ramp;
    this.phased_pricings_attributes = phased_pricings_attributes;
    this.ip_bandwidths = ip_bandwidths;
    this.cloned_from_id = cloned_from_id;
    this.active = active;
    this.lrp_columns = lrp_columns;
    this.new_request = new_request;
  }

  toApi() {
    return {
      id: this.id,
      cloned_from_id: this.cloned_from_id,
      company_interconnections_attributes:  this.company_interconnections.map((ic) => ic.toApi()),
      rack_space_and_powers_attributes: this.rack_space_and_powers.map((sp) => sp.toApi()),
      colocation_options_attributes: this.colocation_options,
      requirement_certifications_attributes: uniqBy(this.certifications),
      load_ramps_array: this.load_ramps_array,
      show_load_ramps: this.show_load_ramps,
      advanced_load_ramp: this.advanced_load_ramp,
      phased_pricings_attributes: this.phased_pricings_attributes,
      ip_bandwidths_attributes: map(this.ip_bandwidths, (ip) => {
        return {
          id: ip.id,
          request_ip_bandwidth: ip.request_ip_bandwidth,
          rate: ip.rate,
          rate_type: ip.rate_type,
          use_burstable_capacity: ip.use_burstable_capacity,
          capacity_rate: ip.capacity_rate,
          _destroy: ip._destroy,
          capacity_rate_type: ip.capacity_rate_type,
          speed_rate: ip.speed_rate,
          speed_rate_type: ip.speed_rate_type,
          quantity_of_ports: ip.quantity_of_ports,
          handoff_type: ip.handoff_type,
          handoff_subtype: ip.handoff_subtype,
          ipv4_required: ip.ipv4_required,
          ipv4_addresses: ip.ipv4_addresses,
          ipv6_required: ip.ipv6_required,
          ipv6_addresses: ip.ipv6_addresses,
          multihomed: ip.multihomed,
          bgp_required: ip.bgp_required,
          bgp_full_required: ip.bgp_full_required,
          handoff_required: ip.handoff_required,
          contract_length_required: ip.contract_length_required,
          port_speed_required: ip.port_speed_required,
          path_diversity_required: ip.path_diversity_required,
          path_diversity_from_existing_circuit_required: ip.path_diversity_from_existing_circuit_required,
          existing_circuit: ip.existing_circuit,
          existing_circuit_file_name: ip.existing_circuit_file_name,
          inheritable_ip_bandwidth_id: ip.inheritable_ip_bandwidth_id,
          entrance_diversity_required: ip.entrance_diversity_required,
          local_loop_diversity_required: ip.local_loop_diversity_required,
          main_route_diversity_required: ip.main_route_diversity_required,
          jumbo_framing_required: ip.jumbo_framing_required,
          usage_based_billing_required: ip.usage_based_billing_required,
          quantity_of_ipv4: ip.quantity_of_ipv4,
          quantity_of_ipv6: ip.quantity_of_ipv6,
          managed_routers: ip.managed_routers,
          existing_circuit_name: ip.existing_circuit_name,
          diverse_local_loops_required: ip.diverse_local_loops_required
        };
      }),
      active: this.active,
      new_request: this.new_request,
      _destroy: this._destroy
    };
  }

  totalRackValue() {
    return reduce(this.rack_space_and_powers, function(sum, s) {
      return sum + (parseInt(s.count) || 0);
    }, 0);
  }

  totalReservedPowerValue() {
    return reduce(this.rack_space_and_powers, function(sum, s) {
      return sum + (parseFloat(s.count) || 0) * (parseFloat(s.power) || 0);
    }, 0);
  }

  interconnectsCount() {
    return reduce(this.company_interconnections, function(sum, i) {
      return sum + (parseInt(i.count) || 0);
    }, 0);
  }

  racksRedundantPower() {
    return reduce(this.rack_space_and_powers, function(sum, s) {
      if (s.redundant_power) {
        return sum + (parseInt(s.count) || 0);
      } else {
        return sum;
      }
    }, 0);
  }

  isReqSizePowerInvalid(r) {
    switch (r.size) {
    case "type_1":
      return // ... calculation;
    case "type_2":
      return // ... calculation;
    case "type_3":
      return // ... calculation;
    case "type_4":
      return // ... calculation;
    case "type_5":
      return // ... calculation;
    default:
      return false;
    }
  }

  isSizePowerInvalid() {
    return some(this.rack_space_and_powers, (r) => {
      return this.isReqSizePowerInvalid(r);
    });
  }

  spaceSizes() {
    return uniq(generateRackSpaceAndPowers(this.rack_space_and_powers));
  }

  isPartialRack(whiteLabel = {}) {
    if (whiteLabel.single_provider) return false;
    return every(this.rack_space_and_powers, (sp) => {
      return includes(["type_1", "type_2", "type_3", "type_4", "type_5"], sp.size);
    });
  }

  speedsCount() {
    let speeds = this.company_interconnections.map((i) => {
      return i.speed_medium;
    });
    return sortedUniq(speeds).length;
  }

  clonedLocReq(project) {
    return this.cloned_from_id && find(project.search.location_requirements, (l) => {
      return l.requirement.id === this.cloned_from_id;
    });
  }

  isValidResult(isRacksValid) {
    if (this.ip_bandwidths[0] && this.ip_bandwidths[0].request_ip_bandwidth) {
      return IsValidIpBandwidth(this.ip_bandwidths[0], true) && isRacksValid;
    } else {
      return every(this.company_interconnections, (i) => !!i.count && !!i.speed_medium) && isRacksValid;
    }
  }

  isValid(project=null, _index=null) {
    if (project) {
      const clonedLocReq = this.clonedLocReq(project);
      if (clonedLocReq) return clonedLocReq.requirement.active;
    }

    if (this.cloned_from_id === 0) return false;

    const isRacksValid = every(this.rack_space_and_powers, (i) => !!i.count && !!i.power) && !this.isSizePowerInvalid();

    return this.isValidResult(isRacksValid);
  }
}

Requirement.newRequirement = () => new Requirement();

export default Requirement;
