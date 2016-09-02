$(function() {

  var db = new AWS.DynamoDB({
    accessKeyId: 'AKIAIMBJAOCWC6BA4FJA',
    secretAccessKey: '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',
    region: 'us-east-1'
  }); 

  var docClient = new AWS.DynamoDB.DocumentClient({
    service: db
  });

  $("#submit_patient_info").submit(function(e) {
    var form_info = $(this).serializeArray();
    e.preventDefault();
    item = {};
    $.each(form_info, function(i, v) {
      item[v.name] = Number(v.value);
    });
    var params = {
      TableName: 'PatientData',
      Item: item
    };
    docClient.put(params, function(err, data) {
      if (err) {
        console.log(err, err.stack); 
      } else {
        console.log(data);
        $("#submit_patient_info")[0].reset();
      }
    });
  });

  $("#get_patient_info").submit(function(e) {
    var form_info = $(this).serializeArray();
    e.preventDefault();
    var params = {
      TableName: 'PatientData',
      ProjectionExpression: '#d, treatment_length, treatment_intensity',
      ExpressionAttributeNames: {
        '#d': 'date'
      },
      KeyConditionExpression: 'patient_id = :p',
      ExpressionAttributeValues: {
        ':p': Number(form_info[0].value)
      }
    };
    docClient.query(params, function(err, data) {
      if (err) {
        console.log(err, err.stack); 
      } else {
        $('#right-panel-info').empty();
        $.each(data.Items, function(i, v) {
          $('#right-panel-info').append(JSON.stringify(v));
        });
      }
    });
  });
})

