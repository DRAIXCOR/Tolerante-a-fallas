// New book
const tb_BookName = document.querySelector("#tb_BookName");
const tb_BookPrice = document.querySelector("#tb_BookPrice");
const tb_BookStock = document.querySelector("#tb_BookStock");
const tb_BookAuthor = document.querySelector("#tb_BookAuthor");
const tb_BookDescription = document.querySelector("#tb_BookDescription");
const tb_BookTags = document.querySelector("#tb_BookTags");
const fu_NewBook = document.querySelector("#fu_NewBook");

// Add Stock
const ddl_BookToStock = document.querySelector("#ddl_BookToStock");
const tb_BookToStock = document.querySelector("#tb_BookToStock");

function createNewBook(){
  var BookName = tb_BookName.value
  var BookPrice = tb_BookPrice.value
  var BookStack = tb_BookStock.value
  var BookAuthor = tb_BookAuthor.value
  var BookDescription = tb_BookDescription.value
  var BookTags = tb_BookTags.value

  var databaseService = firebase.database();
  var referencia = databaseService.ref('Libros');

    // Generate a reference to a new location and add some data using push()
    const newPostRef = referencia.push();

    // Get the unique key generated by push()
    const postId = newPostRef.key;

  var input = fu_NewBook;
  if(input.files && input.files[0]){
    console.log("File Seleccionado : ", input.files[0]);
  }else{
    console.log("No se encontro: ", input.files[0]);
    return;
  }
  
  //Firebase
  var Varstorage = firebase.storage();

  var storageRef = Varstorage.ref('Libros/'+postId+'/'+input.files[0].name);
  var file =input.files[0];
  var uploadTask = storageRef.put(file);

  uploadTask.on("state_changed",function(snapshot){
  var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
  console.log('Upload is ' + progress + '% done');
  switch (snapshot.state) {
      case firebase.storage.TaskState.PAUSED: // or 'paused'
      console.log('Upload is paused');
      break;
  case firebase.storage.TaskState.RUNNING: // or 'running'
      console.log('Upload is running');
      break;
  }
  }, function(error){
          console.log(error);
  }, function(){
          console.log("Archivos subidos correctamente a firebase");
          uploadTask.snapshot.ref.getDownloadURL().then(
            function(downloadURL) {

              referencia = databaseService.ref('Libros/'+postId);
              // escribo en esa referencia
              var envio = new Object();
              envio["Name"]= BookName;
              envio["Author"]= BookAuthor;
              envio["Price"]= BookPrice;
              envio["Stack"]= BookStack;
              envio["Description"]= BookDescription;
              envio["Tags"] = BookTags;
              envio["URL"]= downloadURL;
              referencia.update(
                envio
              );            
          });

      });  
}


async function start(){
    let data = await getDataWithoutUpdating("Libros");
    let newOptions = "";

    console.log(Object.keys(data));
    obj_Data = Object.keys(data);
    for(let i=0; i < Object.keys(data).length ; i++){
        newOptions+=' <option value="'+obj_Data[i]+'">'+data[obj_Data[i]].Name+'</option>';
        
      }

      ddl_BookToStock.innerHTML = newOptions;
}

async function pushStock(){
    let data = await getDataWithoutUpdating("Libros");
    let newStock =  0;
    if(tb_BookToStock.value != ""){
        newStock =     parseInt(tb_BookToStock.value);
    }

    let bookSelected = ddl_BookToStock.value;

 
    newStock += parseInt(data[bookSelected].Stack);
    
    let referencia = firebase_DB.ref('Libros/'+bookSelected);
    // escribo en esa referencia
    var envio = new Object();
    envio["Stack"]= newStock;
    referencia.update(
      envio
    );  

}