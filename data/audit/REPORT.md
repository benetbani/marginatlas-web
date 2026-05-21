# Audit report

Probed 295 URLs.

## Summary

| Class | Count |
|---|---|
| ok | 19 |
| slow | 7 |
| empty | 4 |
| timeout | 265 |

## Top 20 slowest URLs

| ms | status | path |
|---|---|---|
| 9930 | 200 | `/industries/custom-jewelers` |
| 7659 | 200 | `/industries/custom-apparel-mfg` |
| 7528 | 200 | `/industries/small-leather-goods` |
| 5576 | 200 | `/status` |
| 2649 | 200 | `/world` |
| 2450 | 200 | `/compare` |
| 1709 | 200 | `/pricing` |
| 1297 | 200 | `/industries/vintage-consignment` |
| 1138 | 200 | `/industries/lingerie-intimates` |
| 903 | 200 | `/browse` |
| 617 | 200 | `/blog` |
| 577 | 200 | `/coverage` |
| 547 | 200 | `/calculator` |
| 538 | 200 | `/about-data#glossary` |
| 520 | 200 | `/industries` |
| 470 | 200 | `/saved` |
| 469 | 200 | `/you` |
| 450 | 200 | `/about-data` |
| 424 | 200 | `/api/popular-cell-snapshot` |
| 417 | 200 | `/ask` |

## Failures (269)

### empty (4)

| path | status | ms | content | h1? | origin |
|---|---|---|---|---|---|
| `/methodology` | 200 | 505 | 25923B | n | static |
| `/robots.txt` | 200 | 421 | 614B | n | static |
| `/industries/bnbs` | 200 | 258 | 26596B | n | bnbs |
| `/api` | 200 | 344 | 28831B | n | .\src\app\layout.tsx |

### timeout (265)

| path | status | ms | content | h1? | origin |
|---|---|---|---|---|---|
| `/` | 0 | 10018 | 0B | n | static |
| `/random` | 0 | 10009 | 0B | n | static |
| `/sectors/food_drink` | 0 | 10011 | 0B | n | food_drink |
| `/sectors/retail_shops` | 0 | 10012 | 0B | n | retail_shops |
| `/sectors/beauty_wellness` | 0 | 10009 | 0B | n | beauty_wellness |
| `/sectors/trades_home` | 0 | 10012 | 0B | n | trades_home |
| `/sectors/hospitality` | 0 | 10016 | 0B | n | hospitality |
| `/sectors/professional_services` | 0 | 10014 | 0B | n | professional_services |
| `/sectors/software_tech` | 0 | 10012 | 0B | n | software_tech |
| `/sectors/real_estate` | 0 | 10016 | 0B | n | real_estate |
| `/sectors/transport_small` | 0 | 10014 | 0B | n | transport_small |
| `/sectors/manufacturing_artisan` | 0 | 10015 | 0B | n | manufacturing_artisan |
| `/sectors/construction` | 0 | 10016 | 0B | n | construction |
| `/sectors/farming_food_production` | 0 | 10015 | 0B | n | farming_food_production |
| `/sectors/health_clinics` | 0 | 10019 | 0B | n | health_clinics |
| `/sectors/education_instruction` | 0 | 10012 | 0B | n | education_instruction |
| `/sectors/creative_media` | 0 | 10016 | 0B | n | creative_media |
| `/sectors/repair` | 0 | 10015 | 0B | n | repair |
| `/sectors/pet_services` | 0 | 10011 | 0B | n | pet_services |
| `/sectors/events_entertainment` | 0 | 10016 | 0B | n | events_entertainment |
| `/sectors/cultural` | 0 | 10002 | 0B | n | cultural |
| `/sectors/other_local` | 0 | 10016 | 0B | n | other_local |
| `/industries/grain-farming` | 0 | 10015 | 0B | n | grain_farming |
| `/industries/vegetable-fruit-farming` | 0 | 10015 | 0B | n | vegetable_fruit_farming |
| `/industries/livestock-farming` | 0 | 10007 | 0B | n | livestock_farming |
| `/industries/fishing-aquaculture` | 0 | 10013 | 0B | n | fishing_aquaculture |
| `/industries/forestry-logging` | 0 | 10013 | 0B | n | forestry_logging |
| `/industries/food-mfg` | 0 | 10014 | 0B | n | food_mfg |
| `/industries/beverage-mfg` | 0 | 10013 | 0B | n | beverage_mfg |
| `/industries/craft-beer-mfg` | 0 | 10016 | 0B | n | craft_beer_mfg |
| `/industries/coffee-roasters` | 0 | 10009 | 0B | n | coffee_roasters |
| `/industries/specialty-food-production` | 0 | 10016 | 0B | n | specialty_food_production |
| `/industries/artisan-bakery-wholesale` | 0 | 10005 | 0B | n | artisan_bakery_wholesale |
| `/industries/textiles-fabric-mfg` | 0 | 10013 | 0B | n | textiles_fabric_mfg |
| `/industries/apparel-mfg` | 0 | 10025 | 0B | n | apparel_mfg |
| `/industries/wood-products-mfg` | 0 | 10016 | 0B | n | wood_products_mfg |
| `/industries/paper-mfg` | 0 | 10011 | 0B | n | paper_mfg |
| `/industries/custom-furniture-makers` | 0 | 10003 | 0B | n | custom_furniture_makers |
| `/industries/print-shops` | 0 | 10015 | 0B | n | print_shops |
| `/industries/sign-shops` | 0 | 10013 | 0B | n | sign_shops |
| `/industries/soap-candle-makers` | 0 | 10002 | 0B | n | soap_candle_makers |
| `/industries/fabricated-metal-mfg` | 0 | 10004 | 0B | n | fabricated_metal_mfg |
| `/industries/primary-metal-mfg` | 0 | 10013 | 0B | n | primary_metal_mfg |
| `/industries/metal-fab-machine-shops` | 0 | 10014 | 0B | n | metal_fab_machine_shops |
| `/industries/furniture-mfg` | 0 | 10016 | 0B | n | furniture_mfg |
| `/industries/misc-mfg` | 0 | 10007 | 0B | n | misc_mfg |
| `/industries/residential-construction` | 0 | 10002 | 0B | n | residential_construction |
| `/industries/commercial-construction` | 0 | 10005 | 0B | n | commercial_construction |
| `/industries/specialty-trades` | 0 | 10005 | 0B | n | specialty_trades |
| `/industries/plumbers` | 0 | 10005 | 0B | n | plumbers |
| `/industries/electricians` | 0 | 10010 | 0B | n | electricians |
| `/industries/hvac-services` | 0 | 10002 | 0B | n | hvac_services |
| `/industries/painters-residential` | 0 | 10013 | 0B | n | painters_residential |
| `/industries/roofers` | 0 | 10013 | 0B | n | roofers |
| `/industries/carpenters-finish` | 0 | 10002 | 0B | n | carpenters_finish |
| `/industries/flooring-installers` | 0 | 10012 | 0B | n | flooring_installers |
| `/industries/wholesale-food` | 0 | 10015 | 0B | n | wholesale_food |
| `/industries/wholesale-durables` | 0 | 10002 | 0B | n | wholesale_durables |
| `/industries/wholesale-general` | 0 | 10014 | 0B | n | wholesale_general |
| `/industries/grocery-stores` | 0 | 10017 | 0B | n | grocery_stores |
| `/industries/specialty-grocery` | 0 | 10012 | 0B | n | specialty_grocery |
| `/industries/wine-liquor-stores` | 0 | 10008 | 0B | n | wine_liquor_stores |
| `/industries/clothing-stores` | 0 | 10011 | 0B | n | clothing_stores |
| `/industries/boutique-clothing` | 0 | 10017 | 0B | n | boutique_clothing |
| `/industries/streetwear-casual` | 0 | 10016 | 0B | n | streetwear_casual |
| `/industries/designer-fashion` | 0 | 10013 | 0B | n | designer_fashion |
| `/industries/childrens-clothing` | 0 | 10013 | 0B | n | childrens_clothing |
| `/industries/jewelry-stores` | 0 | 10007 | 0B | n | jewelry_stores |
| `/industries/watch-shops` | 0 | 10007 | 0B | n | watch_shops |
| `/industries/eyewear-optical` | 0 | 10016 | 0B | n | eyewear_optical |
| `/industries/shoe-stores` | 0 | 10011 | 0B | n | shoe_stores |
| `/industries/bags-leather-retail` | 0 | 10008 | 0B | n | bags_leather_retail |
| `/industries/electronics-appliance-stores` | 0 | 10007 | 0B | n | electronics_appliance_stores |
| `/industries/furniture-stores` | 0 | 10004 | 0B | n | furniture_stores |
| `/industries/building-garden-stores` | 0 | 10014 | 0B | n | building_garden_stores |
| `/industries/hardware-stores` | 0 | 10008 | 0B | n | hardware_stores |
| `/industries/garden-centers` | 0 | 10016 | 0B | n | garden_centers |
| `/industries/home-decor-gift` | 0 | 10016 | 0B | n | home_decor_gift |
| `/industries/health-beauty-stores` | 0 | 10009 | 0B | n | health_beauty_stores |
| `/industries/cosmetics-shops` | 0 | 10013 | 0B | n | cosmetics_shops |
| `/industries/independent-pharmacy` | 0 | 10017 | 0B | n | independent_pharmacy |
| `/industries/auto-dealers` | 0 | 10013 | 0B | n | auto_dealers |
| `/industries/gas-stations` | 0 | 10006 | 0B | n | gas_stations |
| `/industries/ecommerce-mail-order` | 0 | 10009 | 0B | n | ecommerce_mail_order |
| `/industries/bookstores-indie` | 0 | 10019 | 0B | n | bookstores_indie |
| `/industries/toy-game-stores` | 0 | 10009 | 0B | n | toy_game_stores |
| `/industries/pet-stores` | 0 | 10014 | 0B | n | pet_stores |
| `/industries/sporting-goods-specialty` | 0 | 10016 | 0B | n | sporting_goods_specialty |
| `/industries/art-craft-supplies` | 0 | 10009 | 0B | n | art_craft_supplies |
| `/industries/music-instrument-shops` | 0 | 10013 | 0B | n | music_instrument_shops |
| `/industries/stationery-paper` | 0 | 10020 | 0B | n | stationery_paper |
| `/industries/florist-shops` | 0 | 10013 | 0B | n | florist_shops |
| `/industries/trucking-freight` | 0 | 10016 | 0B | n | trucking_freight |
| `/industries/junk-removal-moving` | 0 | 10010 | 0B | n | junk_removal_moving |
| `/industries/transit-ground-passenger` | 0 | 10010 | 0B | n | transit_ground_passenger |
| `/industries/scenic-sightseeing-transport` | 0 | 10009 | 0B | n | scenic_sightseeing_transport |
| `/industries/transport-support` | 0 | 10015 | 0B | n | transport_support |
| `/industries/warehousing-storage` | 0 | 10007 | 0B | n | warehousing_storage |
| `/industries/restaurants` | 0 | 10014 | 0B | n | restaurants |
| `/industries/sit-down-restaurants` | 0 | 10016 | 0B | n | sit_down_restaurants |
| `/industries/fast-casual` | 0 | 10018 | 0B | n | fast_casual |
| `/industries/cafes-coffee` | 0 | 10010 | 0B | n | cafes_coffee |
| `/industries/bakeries-retail` | 0 | 10015 | 0B | n | bakeries_retail |
| `/industries/pastry-dessert` | 0 | 10016 | 0B | n | pastry_dessert |
| `/industries/ice-cream-shops` | 0 | 10008 | 0B | n | ice_cream_shops |
| `/industries/pizzerias` | 0 | 10006 | 0B | n | pizzerias |
| `/industries/food-trucks` | 0 | 10009 | 0B | n | food_trucks |
| `/industries/tea-houses` | 0 | 10005 | 0B | n | tea_houses |
| `/industries/bars-nightclubs` | 0 | 10003 | 0B | n | bars_nightclubs |
| `/industries/wine-bars` | 0 | 10010 | 0B | n | wine_bars |
| `/industries/pubs-taverns` | 0 | 10004 | 0B | n | pubs_taverns |
| `/industries/breweries-taprooms` | 0 | 10011 | 0B | n | breweries_taprooms |
| `/industries/catering` | 0 | 10004 | 0B | n | catering |
| `/industries/hotels-lodging` | 0 | 10015 | 0B | n | hotels_lodging |
| `/industries/independent-hotels` | 0 | 10015 | 0B | n | independent_hotels |
| `/industries/hostels` | 0 | 10012 | 0B | n | hostels |
| `/industries/str-management` | 0 | 10004 | 0B | n | str_management |
| `/industries/software-development` | 0 | 10010 | 0B | n | software_development |
| `/industries/web-mobile-dev-shops` | 0 | 10067 | 0B | n | web_mobile_dev_shops |
| `/industries/custom-software-contract` | 0 | 10182 | 0B | n | custom_software_contract |
| `/industries/game-dev-studios` | 0 | 10013 | 0B | n | game_dev_studios |
| `/industries/it-services-hosting` | 0 | 10002 | 0B | n | it_services_hosting |
| `/industries/it-services-msp` | 0 | 10007 | 0B | n | it_services_msp |
| `/industries/news-periodical-publishing` | 0 | 10014 | 0B | n | news_periodical_publishing |
| `/industries/motion-picture-recording` | 0 | 10012 | 0B | n | motion_picture_recording |
| `/industries/insurance-brokers` | 0 | 10006 | 0B | n | insurance_brokers |
| `/industries/real-estate-agencies` | 0 | 10014 | 0B | n | real_estate_agencies |
| `/industries/real-estate-leasing` | 0 | 10012 | 0B | n | real_estate_leasing |
| `/industries/equipment-rental` | 0 | 10004 | 0B | n | equipment_rental |
| `/industries/legal-services` | 0 | 10013 | 0B | n | legal_services |
| `/industries/sole-law-firms` | 0 | 10016 | 0B | n | sole_law_firms |
| `/industries/accounting-tax` | 0 | 10003 | 0B | n | accounting_tax |
| `/industries/sole-accounting` | 0 | 10008 | 0B | n | sole_accounting |
| `/industries/management-consulting` | 0 | 10014 | 0B | n | management_consulting |
| `/industries/engineering-architecture` | 0 | 10010 | 0B | n | engineering_architecture |
| `/industries/marketing-design` | 0 | 10014 | 0B | n | marketing_design |
| `/industries/photography-studios` | 0 | 10015 | 0B | n | photography_studios |
| `/industries/videography-services` | 0 | 10014 | 0B | n | videography_services |
| `/industries/wedding-planning` | 0 | 10008 | 0B | n | wedding_planning |
| `/industries/event-production` | 0 | 10011 | 0B | n | event_production |
| `/industries/employment-services` | 0 | 10014 | 0B | n | employment_services |
| `/industries/office-support` | 0 | 10009 | 0B | n | office_support |
| `/industries/travel-agencies` | 0 | 10002 | 0B | n | travel_agencies |
| `/industries/security-services` | 0 | 10001 | 0B | n | security_services |
| `/industries/cleaning-services` | 0 | 10013 | 0B | n | cleaning_services |
| `/industries/residential-cleaning` | 0 | 10006 | 0B | n | residential_cleaning |
| `/industries/landscaping-lawn` | 0 | 10003 | 0B | n | landscaping_lawn |
| `/industries/pool-service` | 0 | 10012 | 0B | n | pool_service |
| `/industries/pest-control-local` | 0 | 10016 | 0B | n | pest_control_local |
| `/industries/window-washing` | 0 | 10013 | 0B | n | window_washing |
| `/industries/primary-secondary-schools` | 0 | 10011 | 0B | n | primary_secondary_schools |
| `/industries/private-k12` | 0 | 10010 | 0B | n | private_k12 |
| `/industries/vocational-training` | 0 | 10013 | 0B | n | vocational_training |
| `/industries/tutoring-centers` | 0 | 10014 | 0B | n | tutoring_centers |
| `/industries/test-prep` | 0 | 10015 | 0B | n | test_prep |
| `/industries/language-schools` | 0 | 10029 | 0B | n | language_schools |
| `/industries/music-schools` | 0 | 10013 | 0B | n | music_schools |
| `/industries/dance-studios` | 0 | 10011 | 0B | n | dance_studios |
| `/industries/driving-schools` | 0 | 10013 | 0B | n | driving_schools |
| `/industries/martial-arts` | 0 | 10015 | 0B | n | martial_arts |
| `/industries/coding-schools` | 0 | 10012 | 0B | n | coding_schools |
| `/industries/art-classes` | 0 | 10015 | 0B | n | art_classes |
| `/industries/doctors-clinics` | 0 | 10015 | 0B | n | doctors_clinics |
| `/industries/chiropractic` | 0 | 10015 | 0B | n | chiropractic |
| `/industries/physical-therapy` | 0 | 10026 | 0B | n | physical_therapy |
| `/industries/optometry` | 0 | 10015 | 0B | n | optometry |
| `/industries/mental-health-practice` | 0 | 10014 | 0B | n | mental_health_practice |
| `/industries/nutritionist` | 0 | 10001 | 0B | n | nutritionist |
| `/industries/dental-practices` | 0 | 10006 | 0B | n | dental_practices |
| `/industries/nursing-elderly` | 0 | 10013 | 0B | n | nursing_elderly |
| `/industries/childcare-social` | 0 | 10015 | 0B | n | childcare_social |
| `/industries/daycare-preschool` | 0 | 10015 | 0B | n | daycare_preschool |
| `/industries/veterinary-pet-care` | 0 | 10015 | 0B | n | veterinary_pet_care |
| `/industries/performing-arts` | 0 | 10014 | 0B | n | performing_arts |
| `/industries/sports-fitness` | 0 | 10012 | 0B | n | sports_fitness |
| `/industries/yoga-pilates` | 0 | 10009 | 0B | n | yoga_pilates |
| `/industries/personal-training` | 0 | 10009 | 0B | n | personal_training |
| `/industries/museums-cultural` | 0 | 10011 | 0B | n | museums_cultural |
| `/industries/hairdressers-beauty` | 0 | 10015 | 0B | n | hairdressers_beauty |
| `/industries/hair-salons-full` | 0 | 10002 | 0B | n | hair_salons_full |
| `/industries/barbershops` | 0 | 10018 | 0B | n | barbershops |
| `/industries/nail-salons` | 0 | 10001 | 0B | n | nail_salons |
| `/industries/day-spas` | 0 | 10016 | 0B | n | day_spas |
| `/industries/massage-therapy` | 0 | 10013 | 0B | n | massage_therapy |
| `/industries/tanning-salons` | 0 | 10014 | 0B | n | tanning_salons |
| `/industries/brow-lash-studios` | 0 | 10003 | 0B | n | brow_lash_studios |
| `/industries/med-spas` | 0 | 10013 | 0B | n | med_spas |
| `/industries/tattoo-piercing` | 0 | 10012 | 0B | n | tattoo_piercing |
| `/industries/auto-repair-shops` | 0 | 10012 | 0B | n | auto_repair_shops |
| `/industries/auto-body-shops` | 0 | 10007 | 0B | n | auto_body_shops |
| `/industries/bike-repair` | 0 | 10015 | 0B | n | bike_repair |
| `/industries/electronics-repair` | 0 | 10002 | 0B | n | electronics_repair |
| `/industries/locksmiths` | 0 | 10017 | 0B | n | locksmiths |
| `/industries/appliance-repair` | 0 | 10015 | 0B | n | appliance_repair |
| `/industries/dry-cleaning-laundry` | 0 | 10009 | 0B | n | dry_cleaning_laundry |
| `/industries/tailoring-alterations` | 0 | 10011 | 0B | n | tailoring_alterations |
| `/industries/shoe-repair` | 0 | 10014 | 0B | n | shoe_repair |
| `/industries/watch-jewelry-repair` | 0 | 10011 | 0B | n | watch_jewelry_repair |
| `/industries/funeral-services` | 0 | 10003 | 0B | n | funeral_services |
| `/industries/pet-daycare` | 0 | 10010 | 0B | n | pet_daycare |
| `/industries/pet-walking-sitting` | 0 | 10014 | 0B | n | pet_walking_sitting |
| `/industries/pet-training` | 0 | 10014 | 0B | n | pet_training |
| `/industries/art-galleries-small` | 0 | 10012 | 0B | n | art_galleries_small |
| `/industries/small-museums` | 0 | 10002 | 0B | n | small_museums |
| `/industries/private-libraries-archives` | 0 | 10015 | 0B | n | private_libraries_archives |
| `/industries/guest-houses` | 0 | 10004 | 0B | n | guest_houses |
| `/industries/campgrounds-rv-parks` | 0 | 10014 | 0B | n | campgrounds_rv_parks |
| `/industries/specialty-construction` | 0 | 10013 | 0B | n | specialty_construction |
| `/us` | 0 | 10011 | 0B | n | US |
| `/de` | 0 | 10002 | 0B | n | DE |
| `/fr` | 0 | 10018 | 0B | n | FR |
| `/it` | 0 | 10002 | 0B | n | IT |
| `/es` | 0 | 10006 | 0B | n | ES |
| `/gb` | 0 | 10010 | 0B | n | GB |
| `/jp` | 0 | 10013 | 0B | n | JP |
| `/br` | 0 | 10017 | 0B | n | BR |
| `/mx` | 0 | 10004 | 0B | n | MX |
| `/ca` | 0 | 10007 | 0B | n | CA |
| `/au` | 0 | 10020 | 0B | n | AU |
| `/nl` | 0 | 10005 | 0B | n | NL |
| `/pl` | 0 | 10006 | 0B | n | PL |
| `/pt` | 0 | 10026 | 0B | n | PT |
| `/be` | 0 | 10007 | 0B | n | BE |
| `/at` | 0 | 10003 | 0B | n | AT |
| `/ch` | 0 | 10011 | 0B | n | CH |
| `/se` | 0 | 10007 | 0B | n | SE |
| `/no` | 0 | 10012 | 0B | n | NO |
| `/dk` | 0 | 10010 | 0B | n | DK |
| `/fi` | 0 | 10010 | 0B | n | FI |
| `/ie` | 0 | 10014 | 0B | n | IE |
| `/gr` | 0 | 10008 | 0B | n | GR |
| `/cz` | 0 | 10019 | 0B | n | CZ |
| `/hu` | 0 | 10004 | 0B | n | HU |
| `/ro` | 0 | 10008 | 0B | n | RO |
| `/in` | 0 | 10006 | 0B | n | IN |
| `/cn` | 0 | 10022 | 0B | n | CN |
| `/ru` | 0 | 10004 | 0B | n | RU |
| `/us/california/restaurants` | 0 | 10007 | 0B | n | us|california|restaurants |
| `/us/new-york/legal-services` | 0 | 10013 | 0B | n | us|new-york|legal-services |
| `/us/us-06-037/restaurants` | 0 | 10017 | 0B | n | us|us-06-037|restaurants |
| `/us/us-06-037/sports-fitness` | 0 | 10016 | 0B | n | us|us-06-037|sports-fitness |
| `/gb/gb/legal-services` | 0 | 10014 | 0B | n | gb|gb|legal-services |
| `/de/de21/fabricated-metal-mfg` | 0 | 10001 | 0B | n | de|de21|fabricated-metal-mfg |
| `/de/de212/restaurants` | 0 | 10009 | 0B | n | de|de212|restaurants |
| `/fr/fr101/jewelry-stores` | 0 | 10007 | 0B | n | fr|fr101|jewelry-stores |
| `/fr/fr101/restaurants` | 0 | 10005 | 0B | n | fr|fr101|restaurants |
| `/it/itc4c/clothing-stores` | 0 | 10006 | 0B | n | it|itc4c|clothing-stores |
| `/it/itc4c/restaurants` | 0 | 10009 | 0B | n | it|itc4c|restaurants |
| `/es/es511/restaurants` | 0 | 10011 | 0B | n | es|es511|restaurants |
| `/jp/jp-13000/restaurants` | 0 | 10006 | 0B | n | jp|jp-13000|restaurants |
| `/jp/japan/restaurants` | 0 | 10006 | 0B | n | jp|japan|restaurants |
| `/br/br-sp/restaurants` | 0 | 10005 | 0B | n | br|br-sp|restaurants |
| `/br/br-city-sao-paulo/restaurants` | 0 | 10026 | 0B | n | br|br-city-sao-paulo|restaurants |
| `/mx/mexico/wholesale-food-beverages` | 0 | 10005 | 0B | n | mx|mexico|wholesale-food-beverages |
| `/mx/mx-roo/hotels-lodging` | 0 | 10012 | 0B | n | mx|mx-roo|hotels-lodging |
| `/ca/ca-on/restaurants` | 0 | 10009 | 0B | n | ca|ca-on|restaurants |
| `/au/au-nsw/restaurants` | 0 | 10004 | 0B | n | au|au-nsw|restaurants |
| `/in/india/software-development` | 0 | 10018 | 0B | n | in|india|software-development |
| `/api/cell-lookup?country=us&industry=restaurants&region=california` | 0 | 10015 | 0B | n | api |
| `/api/cell-snapshot?country=us&geo=california&industry=restaurants` | 0 | 10000 | 0B | n | api |
| `/api/export-csv?country=us&region=california&industry=restaurants` | 0 | 10015 | 0B | n | api |
| `/sectors/manufacturing` | 0 | 10000 | 0B | n | .\src\app\layout.tsx |
| `/#ask-atlas` | 0 | 10004 | 0B | n | .\src\app\layout.tsx |
| `/#newsletter` | 0 | 10003 | 0B | n | .\src\app\layout.tsx |
| `/es/madrid/cafes-coffee` | 0 | 10014 | 0B | n | .\src\components\TaxOverlayTeaser.tsx |

## Suggested actions

- **empty**: page rendered but with no <h1> or under 1kB body. Likely a server component returned null or threw silently. Add a default render path.
- **timeout**: Supabase query or external API stalled. Add a 5s timeout to the data layer and a fallback render path.
- **slow**: cacheable but not cached. Set `Cache-Control: public, s-maxage=21600, stale-while-revalidate=86400` or restore ISR via S-100.
