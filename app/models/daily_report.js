module.exports = function(sequelize) {
  var Sequelize = require('sequelize');
  var singular_model_name = 'DailyReport';
  var plural_model_name = 'DailyReports';

  //--UID encoding
  var assert = require("assert");
  var Hashids = require("hashids");
  var hashids = new Hashids("LeAh Is GoInG pLaCeS rtbbly", 12);

  //--Date formatting
  var moment = require('moment');

  var model = sequelize.define(singular_model_name, {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      uid: {
        type: Sequelize.STRING
      },
      report_date: {
        type: Sequelize.DATE
      },

      prelease_percentage_prv_year: {
        type: Sequelize.DECIMAL(10,10)
      },

      traffic_count_today: {
        type: Sequelize.INTEGER
      },
      traffic_count_week: {
        type: Sequelize.INTEGER
      },


      guarantor_received_count: {
        type: Sequelize.INTEGER
      },


      new_lease_count_today: {
        type: Sequelize.INTEGER
      },
      new_lease_count_week: {
        type: Sequelize.INTEGER
      },
      new_lease_count_YTD: {
        type: Sequelize.INTEGER
      },
      renewal_count_today: {
        type: Sequelize.INTEGER
      },
      renewal_count_week: {
        type: Sequelize.INTEGER
      },
      renewal_count_YTD: {
        type: Sequelize.INTEGER
      },


      leased_floorplan_1x1: {
        type: Sequelize.INTEGER
      },
      leased_floorplan_2x2a: {
        type: Sequelize.INTEGER
      },
      leased_floorplan_2x2b: {
        type: Sequelize.INTEGER
      },
      leased_floorplan_4x2: {
        type: Sequelize.INTEGER
      },
      NOT_leased_floorplan_1x1: {
        type: Sequelize.INTEGER
      },
      NOT_leased_floorplan_2x2a: {
        type: Sequelize.INTEGER
      },
      NOT_leased_floorplan_2x2b: {
        type: Sequelize.INTEGER
      },
      NOT_leased_floorplan_4x2: {
        type: Sequelize.INTEGER
      },

      leased_furnished_count_2x2: {
        type: Sequelize.INTEGER
      },
      leased_furnished_count_4x2: {
        type: Sequelize.INTEGER
      },
      total_furnished_count_2x2: {
        type: Sequelize.INTEGER
      },
      total_furnished_count_4x2: {
        type: Sequelize.INTEGER
      },

      created_at: {
        type: Sequelize.DATE
      },
      updated_at: {
        type: Sequelize.DATE
      }

      }, 

      {
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      freezeTableName: true,
      tableName: plural_model_name,

      hooks: {
        "afterCreate": function(model, options, fn) {
          model.newUID()
          model.save().then(function(model){ fn(null, model) });
        }
      },

      instanceMethods: {
          newUID: function() {
            var _id = this.getDataValue('id');
            this.setDataValue('uid', hashids.encode(_id));
            return this.getDataValue('uid');
          },
          report_date_beautify: function () {
            var _report_date = this.getDataValue('report_date');
            var _report_date_tz = moment(_report_date).add(6, 'hours');
            var _clean_date = moment(_report_date_tz).format("MM/DD/YYYY");
            return _clean_date;
          },
          total_bed_count: function () {
            var fp_one_leased = this.getDataValue('leased_floorplan_1x1');
            var fp_two_leased = this.getDataValue('leased_floorplan_2x2a');
            var fp_three_leased = this.getDataValue('leased_floorplan_2x2b');
            var fp_four_leased = this.getDataValue('leased_floorplan_4x2');

            var fp_one_not_leased = this.getDataValue('NOT_leased_floorplan_1x1');
            var fp_two_not_leased = this.getDataValue('NOT_leased_floorplan_2x2a');
            var fp_three_not_leased = this.getDataValue('NOT_leased_floorplan_2x2b');
            var fp_four_not_leased = this.getDataValue('NOT_leased_floorplan_4x2');

            var total = (
              fp_one_leased + 
              fp_two_leased + 
              fp_three_leased + 
              fp_four_leased + 
              fp_one_not_leased + 
              fp_two_not_leased + 
              fp_three_not_leased + 
              fp_four_not_leased
            );

            return total;
          },
          guarantor_percentage: function () {
            var guarantor_received_count = this.getDataValue('guarantor_received_count');
            var new_lease_count_YTD = this.getDataValue('new_lease_count_YTD');
            var renewal_count_YTD = this.getDataValue('renewal_count_YTD');

            var total_lease_count = (new_lease_count_YTD + renewal_count_YTD);

            var guarantor_percentage = (guarantor_received_count / total_lease_count);

            return guarantor_percentage;
          },
          total_lease_count: function () {
            var new_lease_count_YTD = this.getDataValue('new_lease_count_YTD');
            var renewal_count_YTD = this.getDataValue('renewal_count_YTD');

            var total = (new_lease_count_YTD + renewal_count_YTD);

            return total;
          },
          new_lease_percentage: function () {
            var new_lease_count_YTD = this.getDataValue('new_lease_count_YTD');
            
            var fp_one_leased = this.getDataValue('leased_floorplan_1x1');
            var fp_two_leased = this.getDataValue('leased_floorplan_2x2a');
            var fp_three_leased = this.getDataValue('leased_floorplan_2x2b');
            var fp_four_leased = this.getDataValue('leased_floorplan_4x2');
            var fp_one_not_leased = this.getDataValue('NOT_leased_floorplan_1x1');
            var fp_two_not_leased = this.getDataValue('NOT_leased_floorplan_2x2a');
            var fp_three_not_leased = this.getDataValue('NOT_leased_floorplan_2x2b');
            var fp_four_not_leased = this.getDataValue('NOT_leased_floorplan_4x2');

            var total_bed_count = (
              fp_one_leased + 
              fp_two_leased + 
              fp_three_leased + 
              fp_four_leased + 
              fp_one_not_leased + 
              fp_two_not_leased + 
              fp_three_not_leased + 
              fp_four_not_leased
            );

            var new_lease_percentage = (new_lease_count_YTD / total_bed_count);

            return new_lease_percentage;
          },
          renewal_percentage: function () {
            var renewal_count_YTD = this.getDataValue('renewal_count_YTD');
            
            var fp_one_leased = this.getDataValue('leased_floorplan_1x1');
            var fp_two_leased = this.getDataValue('leased_floorplan_2x2a');
            var fp_three_leased = this.getDataValue('leased_floorplan_2x2b');
            var fp_four_leased = this.getDataValue('leased_floorplan_4x2');
            var fp_one_not_leased = this.getDataValue('NOT_leased_floorplan_1x1');
            var fp_two_not_leased = this.getDataValue('NOT_leased_floorplan_2x2a');
            var fp_three_not_leased = this.getDataValue('NOT_leased_floorplan_2x2b');
            var fp_four_not_leased = this.getDataValue('NOT_leased_floorplan_4x2');

            var total_bed_count = (
              fp_one_leased + 
              fp_two_leased + 
              fp_three_leased + 
              fp_four_leased + 
              fp_one_not_leased + 
              fp_two_not_leased + 
              fp_three_not_leased + 
              fp_four_not_leased
            );

            var renewal_percentage = (renewal_count_YTD / total_bed_count);

            return renewal_percentage;
          },
          prelease_percentage: function () {
            var new_lease_count_YTD = this.getDataValue('new_lease_count_YTD');
            var renewal_count_YTD = this.getDataValue('renewal_count_YTD');

            var total_lease_count = (new_lease_count_YTD + renewal_count_YTD);
            
            var fp_one_leased = this.getDataValue('leased_floorplan_1x1');
            var fp_two_leased = this.getDataValue('leased_floorplan_2x2a');
            var fp_three_leased = this.getDataValue('leased_floorplan_2x2b');
            var fp_four_leased = this.getDataValue('leased_floorplan_4x2');
            var fp_one_not_leased = this.getDataValue('NOT_leased_floorplan_1x1');
            var fp_two_not_leased = this.getDataValue('NOT_leased_floorplan_2x2a');
            var fp_three_not_leased = this.getDataValue('NOT_leased_floorplan_2x2b');
            var fp_four_not_leased = this.getDataValue('NOT_leased_floorplan_4x2');

            var total_bed_count = (
              fp_one_leased + 
              fp_two_leased + 
              fp_three_leased + 
              fp_four_leased + 
              fp_one_not_leased + 
              fp_two_not_leased + 
              fp_three_not_leased + 
              fp_four_not_leased
            );

            var prelease_percentage = (total_lease_count / total_bed_count) * 100;

            return prelease_percentage;
          },
          leased_2x2_furnishings_percentage: function () {
            var leased_furnished_count_2x2 = this.getDataValue('leased_furnished_count_2x2');
            var total_furnished_count_2x2 = this.getDataValue('total_furnished_count_2x2');

            var total_available_2x2 = (leased_furnished_count_2x2 + total_furnished_count_2x2);
            var leased_2x2_furnishings_percentage = (leased_furnished_count_2x2 / total_available_2x2);

            return leased_2x2_furnishings_percentage;
          },
          leased_4x2_furnishings_percentage: function () {
            var leased_furnished_count_4x2 = this.getDataValue('leased_furnished_count_4x2');
            var total_furnished_count_4x2 = this.getDataValue('total_furnished_count_4x2');

            var total_available_4x2 = (leased_furnished_count_4x2 + total_furnished_count_4x2);
            var leased_4x2_furnishings_percentage = (leased_furnished_count_4x2 / total_available_4x2);

            return leased_4x2_furnishings_percentage;
          },
          total_leased_furnishings_percentage: function () {
            var leased_furnished_count_2x2 = this.getDataValue('leased_furnished_count_2x2');
            var leased_furnished_count_4x2 = this.getDataValue('leased_furnished_count_4x2');
            var total_furnished_count_2x2 = this.getDataValue('total_furnished_count_2x2');
            var total_furnished_count_4x2 = this.getDataValue('total_furnished_count_4x2');

            var combined_leased_furnishings_count = (leased_furnished_count_2x2 + leased_furnished_count_4x2);
            var total_available = (leased_furnished_count_2x2 + total_furnished_count_2x2 + leased_furnished_count_4x2 + total_furnished_count_4x2);

            var total_leased_furnishings_percentage = (combined_leased_furnishings_count / total_available);

            return total_leased_furnishings_percentage;
          }
        }
      }
  )

  return {
    model: model,
    model_name: singular_model_name
  }
}