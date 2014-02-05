function mrc_view (mrc) {
  var display_table = document.createElement("table");  // One table per record, to be put into an ol list
  var display_table_tbody = document.createElement("tbody");
  // LEADER
  var leader = mrc.substr(0, 24); // The leader is always the first 24 characters of a MARC record
  var display_table_tr = document.createElement("tr");
  var display_table_td_tag = document.createElement("td");
  display_table_td_tag.appendChild(document.createTextNode("LDR"));
  display_table_td_tag.setAttribute("class","tag");
  display_table_td_tag.setAttribute("className","tag"); // for STUPID IE8
  var display_table_td_ind = document.createElement("td");
  var display_table_td_con = document.createElement("td");
  display_table_td_con.appendChild(document.createTextNode(leader));
  display_table_tr.appendChild(display_table_td_tag);
  display_table_tr.appendChild(display_table_td_ind);
  display_table_tr.appendChild(display_table_td_con);
  display_table_tbody.appendChild(display_table_tr);
  
  var directory_and_fields = mrc.substr(24); // This extracts the rest of the record after the leader
  var mrc_elements = directory_and_fields.split("\x1E"); // The directory ends at the first instance of \x1E
  // The \x1e also divides up all the contents of the fields, so we can use mrc_elements to get those contents too
  var directory = mrc_elements[0]; 
  var how_many_fields = directory.length/12;
  var fields = []; // Array of marc fields!
  for (var i = 0; i < how_many_fields ; i++) {
    var display_table_tr = document.createElement("tr"); // One row per field
    var directory_entry = directory.substr(i*12, 12);
    var field_tag = directory_entry.substr(0, 3); //  The tag, e.g. 100, the first 3 characters of the directory
    // TAG
    var display_table_td = document.createElement("td");
    var field_tag_text = document.createTextNode(field_tag);
    display_table_td.appendChild(field_tag_text);
    display_table_td.setAttribute("class","tag");
    display_table_td.setAttribute("className","tag"); // for STUPID IE8
    display_table_td.setAttribute("valign","top");
    display_table_tr.appendChild(display_table_td);
    // INDICATORS
    var indicators = mrc_elements[i+1].substr(0,2); // The indicators, i.e. first two chars of contents
    indicators = indicators.replace(/ /g,"_");
    if (field_tag<10) { // N.B here the string field_tag is being used as a number. In this case, Javascript makes the conversion for us.
      indicators = "  ";
    }
    var display_table_td = document.createElement("td");
    var indicators_text = document.createTextNode(indicators);
    display_table_td.appendChild(indicators_text);
    display_table_td.setAttribute("class","indicators");
    display_table_td.setAttribute("className","indicators"); // for STUPID IE8
    display_table_td.setAttribute("valign","top");
    display_table_tr.appendChild(display_table_td);
    // CONTENTS
    var display_table_td = document.createElement("td");
    var contents = mrc_elements[i+1].substr(2); // The contents of field, all subfields in together
    if (field_tag<10) {
      contents = mrc_elements[i+1];
    }
    // Split into subfields
    var subfields=contents.match(/\x1f[^\x1f]*/g); // Subfield codes are shown by \x1f. Find all subfield codes followed by their contents
    if (subfields) {
      for (var k=0; k<subfields.length; k++) {
        subfields[k]=subfields[k].replace(/\x1f/g, "$"); // This line changes \x1f to the traditional $ to make them visible.
        var subfield_code_span = document.createElement("span");
        subfield_code_span.appendChild(document.createTextNode(subfields[k].substr(0,2)));
        subfield_code_span.setAttribute("class", "subfield_code");
        subfield_code_span.setAttribute("className","subfield_code"); // for STUPID IE8
        var subfield_contents_span = document.createElement("span");
        subfield_contents_span.appendChild(document.createTextNode(subfields[k].substr(2)));
        subfield_contents_span.setAttribute("class", "subfield_contents");
        subfield_contents_span.setAttribute("className","subfield_contents"); // for STUPID IE8
        display_table_td.appendChild(subfield_code_span);
        display_table_td.appendChild(subfield_contents_span);
      }
    }
    else {
      var fixed_field_contents = document.createTextNode(mrc_elements[i+1]);
      display_table_td.appendChild(fixed_field_contents);
    }
    display_table_tr.appendChild(display_table_td);
    display_table_tbody.appendChild(display_table_tr);
  }
  display_table.appendChild(display_table_tbody);
  return display_table;
}

function reset_page () {
  var element = document.getElementById("records_list");
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
  var element = document.getElementById("report");
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

function view_marc() {
  reset_page();
  var marc_input=document.mrc_input_form.mrc_input_textarea.value;
  if (marc_input.match(/^http/g)) {
    // Placeholder for planned entry of remote URL feature 8-)
  }
  else {
    marc_records=marc_input.split("\x1d");
    marc_records_no=marc_records.length-1;
    
    //REPORT
    var plural_s = "s";
    if (marc_records_no==1) {
      plural_s="";
    }
    var report_contents = document.createTextNode(marc_records_no + " record"+plural_s+" found.\n");
    var report_p = document.getElementById("report");
    report_p.appendChild(report_contents);
    
    //INDEX
    var index_contents = "";
    var index_step=1;
    if (marc_records_no>100) {
      index_step=10;
    }
    if (marc_records_no>1000) {
      index_step=1000;
    }
    //INDEX_ENTRY
    for (var i=0; i<marc_records_no; i=i+index_step) {
      var j=i+1;
      index_contents+="<a href='#record"+j+"'>"+j+"</a> ";
    }
    var index_p = document.getElementById("index");
    index_p.innerHTML=index_contents;

    //RECORDS
    for (var i=0; i<marc_records_no; i++) {
      //document.mrc_input_form.test_output.value+= "RECORD NO" + i + mrc_view(marc_records[i]);
      var record_list_a = document.createElement("a");
      var j=i+1;
      record_list_a.setAttribute("name","record"+j);
      //record_list_a.appendChild(document.createTextNode("blah"));
      var record_list_li = document.createElement("li");
      //var record_list_table = document.createElement("table");
      //var record_list_contents = document.createTextNode(mrc_view(marc_records[i]));
      //record_list_p.appendChild(record_list_contents);
      //record_list_table.innerHTML=mrc_view(marc_records[i]);
      record_list_li.appendChild(record_list_a);
      record_list_li.appendChild(mrc_view(marc_records[i]));
      //record_list_li.appendChild(record_list_table);
      records_ol=document.getElementById("records_list");
      records_ol.appendChild(record_list_li);
    }
  }
}
var marc_records=[];
