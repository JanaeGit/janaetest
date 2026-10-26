/**
 * Tropic West Health booking notification endpoint.
 * Deploy as Apps Script Web App: Execute as Me; access Anyone.
 * Keep SCRIPT_SHARED_SECRET private in Apps Script Script Properties.
 * The Worker posts only after the D1 reservation succeeds.
 */
function doPost(e) {
  try {
    var data = JSON.parse((e && e.postData && e.postData.contents) || "{}");
    var expected = PropertiesService.getScriptProperties().getProperty("SCRIPT_SHARED_SECRET");
    if (!expected || String(data.secret || "") !== expected) return json_({ok:false,error:"Not authorized"});
    if (!data.id || !data.date || !data.time || !data.name || !data.email || !data.service) return json_({ok:false,error:"Missing required fields"});
    var to = "nurse@tropicwesthealth.com";
    var cc = "garinejanae@gmail.com";
    var ref = String(data.id);
    var date = String(data.date), time=String(data.time), service=String(data.service);
    var name=String(data.name), email=String(data.email), phone=String(data.phone||"");
    var clinicBody = "A Tropic West Health appointment has been confirmed.\n\n"+
      "Booking reference: "+ref+"\nPatient: "+name+"\nEmail: "+email+
      "\nPhone: "+phone+"\nService: "+service+"\nDate: "+date+
      "\nTime: "+time+" Eastern\n\nThis is an automated confirmation.";
    var patientBody = "Hello "+name+",\n\nYour Tropic West Health appointment is confirmed.\n\n"+
      "Service: "+service+"\nDate: "+date+"\nTime: "+time+" Eastern\n"+
      "Booking reference: "+ref+"\n\nFor changes, call (727) 465-6021.\n\nTropic West Health";
    // Sending from the Google account that owns/authorized this Apps Script.
    GmailApp.sendEmail(to,"Tropic West Health - Confirmed Appointment",clinicBody,{cc:cc,name:"Tropic West Health"});
    GmailApp.sendEmail(email,"Your Tropic West Health Appointment Is Confirmed",patientBody,{name:"Tropic West Health"});
    return json_({ok:true});
  } catch (err) {
    return json_({ok:false,error:"Notification delivery failed"});
  }
}
function json_(obj) { return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON); }
