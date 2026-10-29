export const DEFAULT_DISTRICTS = [
  // West Zone
  { id: 'coimbatore', name: 'Coimbatore', zone: 'West Zone', activeBuses: 6, routes: 12 },
  { id: 'erode', name: 'Erode', zone: 'West Zone', activeBuses: 6, routes: 8 },
  { id: 'tiruppur', name: 'Tiruppur', zone: 'West Zone', activeBuses: 5, routes: 7 },
  { id: 'salem', name: 'Salem', zone: 'West Zone', activeBuses: 4, routes: 6 },
  { id: 'nilgiris', name: 'The Nilgiris', zone: 'West Zone', activeBuses: 2, routes: 4 },
  { id: 'namakkal', name: 'Namakkal', zone: 'West Zone', activeBuses: 2, routes: 4 },

  // South Zone
  { id: 'madurai', name: 'Madurai', zone: 'South Zone', activeBuses: 4, routes: 9 },
  { id: 'dindigul', name: 'Dindigul', zone: 'South Zone', activeBuses: 2, routes: 5 },
  { id: 'tirunelveli', name: 'Tirunelveli', zone: 'South Zone', activeBuses: 2, routes: 5 },
  { id: 'kanyakumari', name: 'Kanyakumari', zone: 'South Zone', activeBuses: 2, routes: 4 },

  // Central Zone
  { id: 'trichy', name: 'Tiruchirappalli', zone: 'Central Zone', activeBuses: 3, routes: 8 },
  { id: 'thanjavur', name: 'Thanjavur', zone: 'Central Zone', activeBuses: 2, routes: 5 },
  { id: 'karur', name: 'Karur', zone: 'Central Zone', activeBuses: 2, routes: 4 },

  // North Zone
  { id: 'chennai', name: 'Chennai', zone: 'North Zone', activeBuses: 4, routes: 14 },
  { id: 'vellore', name: 'Vellore', zone: 'North Zone', activeBuses: 2, routes: 5 },
  { id: 'krishnagiri', name: 'Krishnagiri', zone: 'North Zone', activeBuses: 2, routes: 4 },
];

export const DEFAULT_ROUTES = [
  {
    id: 'ROUTE-CBE-101',
    name: 'Route 70: Gandhipuram - Marudhamalai',
    districtId: 'coimbatore',
    start: 'Gandhipuram Central BS',
    end: 'Marudhamalai Temple',
    towns: ['Coimbatore', 'Cross Cut', 'Lawley Road', 'Vadavalli', 'Marudhamalai'],
    stops: [
      { id: 'ST-CBE-01', name: 'Gandhipuram Central BS', lat: '11.0168', lng: '76.9558', isKeyStop: true },
      { id: 'ST-CBE-02', name: 'Cross Cut Road', lat: '11.0210', lng: '76.9602', isKeyStop: false },
      { id: 'ST-CBE-03', name: 'Lawley Road Jn', lat: '11.0125', lng: '76.9360', isKeyStop: false },
      { id: 'ST-CBE-04', name: 'TNAU Campus', lat: '11.0135', lng: '76.9280', isKeyStop: false },
      { id: 'ST-CBE-05', name: 'Vadavalli Terminal', lat: '11.0264', lng: '76.9038', isKeyStop: false },
      { id: 'ST-CBE-06', name: 'Marudhamalai Foothills', lat: '11.0450', lng: '76.8525', isKeyStop: true }
    ]
  },
  {
    id: 'ROUTE-CBE-102',
    name: 'Route 3: Gandhipuram - Ukkadam BS',
    districtId: 'coimbatore',
    start: 'Gandhipuram BS',
    end: 'Ukkadam Bus Stand',
    towns: ['Coimbatore', 'Railway Station', 'Town Hall', 'Ukkadam'],
    stops: [
      { id: 'ST-CBE-11', name: 'Gandhipuram BS', lat: '11.0168', lng: '76.9558', isKeyStop: true },
      { id: 'ST-CBE-12', name: 'Coimbatore Junction RS', lat: '10.9995', lng: '76.9635', isKeyStop: false },
      { id: 'ST-CBE-13', name: 'Town Hall', lat: '10.9960', lng: '76.9610', isKeyStop: false },
      { id: 'ST-CBE-14', name: 'Ukkadam Bus Stand', lat: '10.9880', lng: '76.9580', isKeyStop: true }
    ]
  },
  {
    id: 'ROUTE-CBE-103',
    name: 'Route 112X: Gandhipuram - Palladam - Kangayam',
    districtId: 'coimbatore',
    start: 'Gandhipuram Central BS',
    end: 'Kangayam Bus Stand',
    towns: ['Coimbatore', 'Singanallur', 'Sulur', 'Palladam', 'Kangayam'],
    stops: [
      { id: 'ST-CBE-KGM-01', name: 'Gandhipuram Central BS', lat: '11.0168', lng: '76.9558', isKeyStop: true },
      { id: 'ST-CBE-KGM-02', name: 'Singanallur Bus Terminal', lat: '11.0010', lng: '77.0260', isKeyStop: true },
      { id: 'ST-CBE-KGM-03', name: 'Sulur Aero Town', lat: '11.0320', lng: '77.1250', isKeyStop: false },
      { id: 'ST-CBE-KGM-04', name: 'Palladam Central Bus Stand', lat: '10.9980', lng: '77.2910', isKeyStop: true },
      { id: 'ST-CBE-KGM-05', name: 'Kangayam Bus Stand', lat: '11.0055', lng: '77.5583', isKeyStop: true }
    ]
  },
  {
    id: 'ROUTE-CBE-104',
    name: 'Route 55: Ukkadam - Pollachi - Udumalaipettai',
    districtId: 'coimbatore',
    start: 'Ukkadam Bus Stand',
    end: 'Udumalaipettai Central BS',
    towns: ['Coimbatore', 'Kinathukadavu', 'Pollachi', 'Gomangalam', 'Udumalaipettai'],
    stops: [
      { id: 'ST-UDM-01', name: 'Ukkadam Bus Stand', lat: '10.9880', lng: '76.9580', isKeyStop: true },
      { id: 'ST-UDM-02', name: 'Kinathukadavu Bus Stop', lat: '10.8190', lng: '77.0190', isKeyStop: false },
      { id: 'ST-UDM-03', name: 'Pollachi New Bus Stand', lat: '10.6610', lng: '77.0060', isKeyStop: true },
      { id: 'ST-UDM-04', name: 'Gomangalam', lat: '10.6120', lng: '77.1450', isKeyStop: false },
      { id: 'ST-UDM-05', name: 'Udumalaipettai Central BS', lat: '10.5840', lng: '77.2470', isKeyStop: true }
    ]
  },
  {
    id: 'ROUTE-CBE-105',
    name: 'Route 4A: Gandhipuram - Mettupalayam',
    districtId: 'coimbatore',
    start: 'Gandhipuram Bus Stand',
    end: 'Mettupalayam Bus Stand',
    towns: ['Coimbatore', 'Thudiyalur', 'Periyanaickenpalayam', 'Karamadai', 'Mettupalayam'],
    stops: [
      { id: 'ST-MTP-01', name: 'Gandhipuram Bus Stand', lat: '11.0168', lng: '76.9558', isKeyStop: true },
      { id: 'ST-MTP-02', name: 'Thudiyalur Jn', lat: '11.0820', lng: '76.9380', isKeyStop: false },
      { id: 'ST-MTP-03', name: 'Periyanaickenpalayam', lat: '11.1460', lng: '76.9320', isKeyStop: false },
      { id: 'ST-MTP-04', name: 'Karamadai Bus Stop', lat: '11.2420', lng: '76.9580', isKeyStop: false },
      { id: 'ST-MTP-05', name: 'Mettupalayam Bus Stand', lat: '11.3015', lng: '76.9510', isKeyStop: true }
    ]
  },
  {
    id: 'ROUTE-ER-101',
    name: 'Route 1A: Erode BS - Gobi',
    districtId: 'erode',
    start: 'Erode Bus Stand',
    end: 'Gobichettipalayam',
    towns: ['Erode', 'Chithode', 'Kavindapadi', 'Gobichettipalayam'],
    stops: [
      { id: 'ST-01', name: 'Erode Bus Stand', lat: '11.3410', lng: '77.7172', isKeyStop: true },
      { id: 'ST-02', name: 'Chithode', lat: '11.3855', lng: '77.6713', isKeyStop: false },
      { id: 'ST-03', name: 'Kavindapadi', lat: '11.4167', lng: '77.5833', isKeyStop: false },
      { id: 'ST-04', name: 'Gobichettipalayam BS', lat: '11.4552', lng: '77.4385', isKeyStop: true }
    ]
  },
  {
    id: 'ROUTE-ER-102',
    name: 'Route 45: Erode - Kangayam - Dharapuram',
    districtId: 'erode',
    start: 'Erode Central Bus Stand',
    end: 'Dharapuram Bus Stand',
    towns: ['Erode', 'Solar', 'Muthur', 'Kangayam', 'Kundadam', 'Dharapuram'],
    stops: [
      { id: 'ST-ER-KGM-01', name: 'Erode Central Bus Stand', lat: '11.3410', lng: '77.7172', isKeyStop: true },
      { id: 'ST-ER-KGM-02', name: 'Solar Bus Terminal', lat: '11.3120', lng: '77.7450', isKeyStop: false },
      { id: 'ST-ER-KGM-03', name: 'Muthur Bus Stop', lat: '11.1180', lng: '77.6320', isKeyStop: false },
      { id: 'ST-ER-KGM-04', name: 'Kangayam Central Bus Stand', lat: '11.0055', lng: '77.5583', isKeyStop: true },
      { id: 'ST-ER-KGM-05', name: 'Kundadam Pirivu', lat: '10.8750', lng: '77.6020', isKeyStop: false },
      { id: 'ST-ER-KGM-06', name: 'Dharapuram Central Bus Stand', lat: '10.7280', lng: '77.5260', isKeyStop: true }
    ]
  },
  {
    id: 'ROUTE-ER-103',
    name: 'Route 12B: Erode - Gobichettipalayam - Sathyamangalam',
    districtId: 'erode',
    start: 'Erode Bus Stand',
    end: 'Sathyamangalam Bus Stand',
    towns: ['Erode', 'Chithode', 'Kavindapadi', 'Gobichettipalayam', 'Sathyamangalam'],
    stops: [
      { id: 'ST-STY-01', name: 'Erode Bus Stand', lat: '11.3410', lng: '77.7172', isKeyStop: true },
      { id: 'ST-STY-02', name: 'Chithode Jn', lat: '11.3855', lng: '77.6713', isKeyStop: false },
      { id: 'ST-STY-03', name: 'Kavindapadi', lat: '11.4167', lng: '77.5833', isKeyStop: false },
      { id: 'ST-STY-04', name: 'Gobichettipalayam Bus Stand', lat: '11.4552', lng: '77.4385', isKeyStop: true },
      { id: 'ST-STY-05', name: 'Alathucombai', lat: '11.4820', lng: '77.3420', isKeyStop: false },
      { id: 'ST-STY-06', name: 'Sathyamangalam Bus Stand', lat: '11.5042', lng: '77.2415', isKeyStop: true }
    ]
  },
  {
    id: 'ROUTE-TPR-101',
    name: 'Route 24: Tiruppur Old BS - Kangayam',
    districtId: 'tiruppur',
    start: 'Tiruppur Old Bus Stand',
    end: 'Kangayam Bus Stand',
    towns: ['Tiruppur', 'Nallur', 'Kovilvazhi', 'Kangayam'],
    stops: [
      { id: 'ST-KGM-01', name: 'Tiruppur Old Bus Stand', lat: '11.1085', lng: '77.3411', isKeyStop: true },
      { id: 'ST-KGM-02', name: 'Nallur Branch', lat: '11.0820', lng: '77.3750', isKeyStop: false },
      { id: 'ST-KGM-03', name: 'Kovilvazhi Jn', lat: '11.0560', lng: '77.4120', isKeyStop: false },
      { id: 'ST-KGM-04', name: 'Chengapalli Pirivu', lat: '11.0310', lng: '77.4850', isKeyStop: false },
      { id: 'ST-KGM-05', name: 'Kangayam Central Bus Stand', lat: '11.0055', lng: '77.5583', isKeyStop: true }
    ]
  },
  {
    id: 'ROUTE-SLM-101',
    name: 'Route 18: Salem New BS - Omalur - Mettur Dam',
    districtId: 'salem',
    start: 'Salem New Bus Stand',
    end: 'Mettur Dam Bus Stand',
    towns: ['Salem', 'Omalur', 'Mecheri', 'Mettur'],
    stops: [
      { id: 'ST-MTR-01', name: 'Salem New Bus Stand', lat: '11.6643', lng: '78.1460', isKeyStop: true },
      { id: 'ST-MTR-02', name: 'Mamangam Jn', lat: '11.6920', lng: '78.1150', isKeyStop: false },
      { id: 'ST-MTR-03', name: 'Omalur Bus Stand', lat: '11.7450', lng: '78.0410', isKeyStop: true },
      { id: 'ST-MTR-04', name: 'Mecheri Town', lat: '11.8310', lng: '77.9450', isKeyStop: false },
      { id: 'ST-MTR-05', name: 'Mettur Dam Bus Stand', lat: '11.7960', lng: '77.8010', isKeyStop: true }
    ]
  }
];

export const DEFAULT_BUSES = [
  // Coimbatore Fleet
  { id: 'BUS-CBE-101', districtId: 'coimbatore', plate: 'TN-38-N-2415', capacity: 55, route: 'Gandhipuram - Marudhamalai', routeId: 'ROUTE-CBE-101', status: 'Active' },
  { id: 'BUS-CBE-102', districtId: 'coimbatore', plate: 'TN-38-N-3890', capacity: 50, route: 'Gandhipuram - Ukkadam BS', routeId: 'ROUTE-CBE-102', status: 'Active' },
  { id: 'BUS-CBE-103', districtId: 'coimbatore', plate: 'TN-38-N-4122', capacity: 60, route: 'Ukkadam - Pollachi BS', routeId: 'ROUTE-CBE-104', status: 'Active' },
  { id: 'BUS-CBE-104', districtId: 'coimbatore', plate: 'TN-38-N-5011', capacity: 55, route: 'Singanallur - Gandhipuram', status: 'Active' },
  { id: 'BUS-CBE-105', districtId: 'coimbatore', plate: 'TN-38-N-6330', capacity: 52, route: 'Gandhipuram - Thudiyalur', status: 'Maintenance' },
  { id: 'BUS-CBE-106', districtId: 'coimbatore', plate: 'TN-38-N-7722', capacity: 55, route: 'Route 112X: Gandhipuram - Palladam - Kangayam', routeId: 'ROUTE-CBE-103', status: 'Active' },
  { id: 'BUS-CBE-107', districtId: 'coimbatore', plate: 'TN-38-N-8833', capacity: 60, route: 'Route 55: Ukkadam - Pollachi - Udumalaipettai', routeId: 'ROUTE-CBE-104', status: 'Active' },
  { id: 'BUS-CBE-108', districtId: 'coimbatore', plate: 'TN-38-N-9944', capacity: 55, route: 'Route 4A: Gandhipuram - Mettupalayam', routeId: 'ROUTE-CBE-105', status: 'Active' },

  // Erode Fleet
  { id: 'BUS-ER-101', districtId: 'erode', plate: 'TN-33-N-1234', capacity: 55, route: 'Erode BS - Gobichettipalayam', routeId: 'ROUTE-ER-101', status: 'Active' },
  { id: 'BUS-ER-102', districtId: 'erode', plate: 'TN-33-N-5678', capacity: 50, route: 'Erode BS - Perundurai', status: 'Active' },
  { id: 'BUS-ER-103', districtId: 'erode', plate: 'TN-33-N-9012', capacity: 60, route: 'Erode BS - Bhavani', status: 'Maintenance' },
  { id: 'BUS-ER-104', districtId: 'erode', plate: 'TN-33-N-3456', capacity: 52, route: 'Erode BS - Sathyamangalam', routeId: 'ROUTE-ER-103', status: 'Active' },
  { id: 'BUS-ER-105', districtId: 'erode', plate: 'TN-33-N-7788', capacity: 55, route: 'Route 45: Erode - Kangayam - Dharapuram', routeId: 'ROUTE-ER-102', status: 'Active' },
  { id: 'BUS-ER-106', districtId: 'erode', plate: 'TN-33-N-8899', capacity: 50, route: 'Route 12B: Erode - Gobichettipalayam - Sathyamangalam', routeId: 'ROUTE-ER-103', status: 'Active' },

  // Salem Fleet
  { id: 'BUS-SLM-101', districtId: 'salem', plate: 'TN-30-N-1122', capacity: 55, route: 'Salem Old BS - New BS', status: 'Active' },
  { id: 'BUS-SLM-102', districtId: 'salem', plate: 'TN-30-N-2244', capacity: 50, route: 'Salem BS - Omalur', status: 'Active' },
  { id: 'BUS-SLM-103', districtId: 'salem', plate: 'TN-30-N-3366', capacity: 58, route: 'Salem BS - Attur', status: 'Maintenance' },
  { id: 'BUS-SLM-104', districtId: 'salem', plate: 'TN-30-N-4477', capacity: 55, route: 'Route 18: Salem New BS - Omalur - Mettur Dam', routeId: 'ROUTE-SLM-101', status: 'Active' },

  // Tiruppur Fleet
  { id: 'BUS-TPR-101', districtId: 'tiruppur', plate: 'TN-39-N-1010', capacity: 52, route: 'Old Bus Stand - New Bus Stand', status: 'Active' },
  { id: 'BUS-TPR-102', districtId: 'tiruppur', plate: 'TN-39-N-2020', capacity: 55, route: 'Tiruppur - Avinashi', status: 'Active' },
  { id: 'BUS-TPR-103', districtId: 'tiruppur', plate: 'TN-39-N-3030', capacity: 50, route: 'Tiruppur - Palladam', status: 'Active' },
  { id: 'BUS-TPR-104', districtId: 'tiruppur', plate: 'TN-39-N-4455', capacity: 55, route: 'Route 24: Tiruppur Old BS - Kangayam', routeId: 'ROUTE-TPR-101', status: 'Active' },
  { id: 'BUS-TPR-105', districtId: 'tiruppur', plate: 'TN-39-N-5566', capacity: 50, route: 'Route 45: Erode - Kangayam - Dharapuram', routeId: 'ROUTE-ER-102', status: 'Active' },

  // Chennai Fleet
  { id: 'BUS-CHN-101', districtId: 'chennai', plate: 'TN-01-N-1234', capacity: 60, route: 'Route 570: CMBT Koyambedu - Kelambakkam', status: 'Active' },
  { id: 'BUS-CHN-102', districtId: 'chennai', plate: 'TN-01-N-5678', capacity: 55, route: 'Route 29C: Perambur - Besant Nagar', status: 'Active' },
  { id: 'BUS-CHN-103', districtId: 'chennai', plate: 'TN-01-N-9012', capacity: 60, route: 'Route 70: Avadi - Tambaram', status: 'Active' },

  // Madurai Fleet
  { id: 'BUS-MDU-101', districtId: 'madurai', plate: 'TN-58-N-1122', capacity: 55, route: 'Route 77: Mattuthavani MIBT - Thirumangalam', status: 'Active' },
  { id: 'BUS-MDU-102', districtId: 'madurai', plate: 'TN-58-N-3344', capacity: 55, route: 'Route 48: Periyar BS - Alagar Kovil', status: 'Active' },
  { id: 'BUS-MDU-103', districtId: 'madurai', plate: 'TN-58-N-5566', capacity: 50, route: 'Route 3A: Arappalayam - Anuppanadi', status: 'Maintenance' },

  // Trichy Fleet
  { id: 'BUS-TRY-101', districtId: 'trichy', plate: 'TN-45-N-9988', capacity: 55, route: 'Route 1: Central BS - Chatram BS - Srirangam', status: 'Active' },
  { id: 'BUS-TRY-102', districtId: 'trichy', plate: 'TN-45-N-7766', capacity: 50, route: 'Route 102: Central BS - Thuvakudi NIT', status: 'Active' },

  // Tirunelveli Fleet
  { id: 'BUS-TNV-101', districtId: 'tirunelveli', plate: 'TN-72-N-5544', capacity: 55, route: 'Route 10: New Bus Stand - Junction - Palayamkottai', status: 'Active' },
  { id: 'BUS-TNV-102', districtId: 'tirunelveli', plate: 'TN-72-N-6677', capacity: 52, route: 'Route 35: Tirunelveli - Cheranmahadevi', status: 'Active' },

  // Kanyakumari Fleet
  { id: 'BUS-KK-101', districtId: 'kanyakumari', plate: 'TN-74-N-1234', capacity: 55, route: 'Route 5: Nagercoil Christopher BS - Kanyakumari Beach', status: 'Active' },
  { id: 'BUS-KK-102', districtId: 'kanyakumari', plate: 'TN-74-N-5678', capacity: 50, route: 'Route 12: Nagercoil - Thuckalay - Marthandam', status: 'Active' },

  // The Nilgiris Fleet
  { id: 'BUS-NLG-101', districtId: 'nilgiris', plate: 'TN-43-N-4321', capacity: 45, route: 'Route 1: Ooty Central BS - Coonoor BS', status: 'Active' },
  { id: 'BUS-NLG-102', districtId: 'nilgiris', plate: 'TN-43-N-8765', capacity: 42, route: 'Route 8: Ooty BS - Kotagiri BS', status: 'Active' },

  // Namakkal Fleet
  { id: 'BUS-NMK-101', districtId: 'namakkal', plate: 'TN-28-N-7890', capacity: 55, route: 'Route 15: Namakkal BS - Tiruchengode BS', status: 'Active' },
  { id: 'BUS-NMK-102', districtId: 'namakkal', plate: 'TN-28-N-4321', capacity: 52, route: 'Route 7: Namakkal - Rasipuram', status: 'Active' },

  // Dindigul Fleet
  { id: 'BUS-DGL-101', districtId: 'dindigul', plate: 'TN-57-N-6543', capacity: 55, route: 'Route 22: Dindigul Central BS - Palani BS', status: 'Active' },
  { id: 'BUS-DGL-102', districtId: 'dindigul', plate: 'TN-57-N-3210', capacity: 50, route: 'Route 4: Dindigul - Natham', status: 'Active' },

  // Thanjavur Fleet
  { id: 'BUS-TNJ-101', districtId: 'thanjavur', plate: 'TN-49-N-3456', capacity: 55, route: 'Route 8: Old Bus Stand - New Bus Stand - Kumbakonam', status: 'Active' },

  // Karur Fleet
  { id: 'BUS-KRR-101', districtId: 'karur', plate: 'TN-47-N-8877', capacity: 55, route: 'Route 14: Karur Bus Stand - Velur - Paramathi', status: 'Active' },

  // Vellore Fleet
  { id: 'BUS-VLR-101', districtId: 'vellore', plate: 'TN-23-N-5432', capacity: 55, route: 'Route 3: Old Bus Stand - Katpadi Railway Jn', status: 'Active' },

  // Krishnagiri Fleet
  { id: 'BUS-KGI-101', districtId: 'krishnagiri', plate: 'TN-24-N-9876', capacity: 55, route: 'Route 100: Hosur Bus Stand - Krishnagiri Central BS', status: 'Active' }
];
