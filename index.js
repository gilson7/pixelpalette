const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const cnvEdited = document.getElementById('canvasEdited');
const editedCtx  = cnvEdited.getContext('2d')
let inputFile = document.getElementById("imagem")
let imgPreview = document.getElementById("preview")
let imgOriginal = document.getElementById("original")
let inputPallete = document.getElementById("pallete")
let lastInput;
document.getElementById("uploadPallete").onclick = function(){
    inputPallete.click()
}

// adicionando paleta
inputPallete.addEventListener('change', function() {
    document.getElementById("lll").innerHTML = ""
    if (inputPallete.files.length > 0) {

        const file = inputPallete.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function(event) {
            let img = new Image();
            // Defina o caminho da imagem
            img.src = event.target.result
            // Quando a imagem for carregada, execute o código abaixo
            img.onload = function() {
            // Crie um novo elemento canvas
            let palletCanvas = document.createElement('canvas');
            // Defina o tamanho do canvas igual ao tamanho da imagem
            palletCanvas.width = img.width;
            palletCanvas.height = img.height;
            // Obtenha o contexto 2D do canvas
            let paletteCtx = palletCanvas.getContext('2d');
            // Desenhe a imagem no canvas
            paletteCtx.drawImage(img, 0, 0);
            // Obtenha os dados de pixels do contexto 2D
            let imageData = paletteCtx.getImageData(0, 0, palletCanvas.width, palletCanvas.height);
            let pixels = imageData.data;
            // Crie um objeto para armazenar as cores únicas
            let uniqueColors = {};
            // Percorra os pixels e adicione as cores únicas ao objeto
            for (let i = 0; i < pixels.length; i += 4) {
                let color = `${pixels[i]},${pixels[i + 1]},${pixels[i + 2]}`;
                if (!uniqueColors[color]) {
                uniqueColors[color] = true;
                }
            }
            console.log(uniqueColors)
            // Percorra as cores únicas e desenhe um retângulo de uma única cor para cada cor presente na imagem
            Object.keys(uniqueColors).forEach(function(color) {
                let parts = color.split(',');
                let ele = document.createElement("button")
                ele.onclick = function(){change(rgbToHex(`${parts[0]},${parts[1]},${parts[2]}`))}
                ele.style.backgroundColor = `rgb(${parts[0]},${parts[1]},${parts[2]})`
                document.getElementById("lll").appendChild(ele);
            });
            // Adicione o canvas ao documento
          
            };
        }
    }
})
document.getElementById("upload").onclick = function(){
    inputFile.click()
}
inputFile.addEventListener('change', function() {
    // Verifique se o usuário selecionou um arquivo
    if (inputFile.files.length > 0) {
      const file = inputFile.files[0];
  
      // Crie um objeto FileReader para ler o arquivo
      const reader = new FileReader();
      reader.readAsDataURL(file);
  
      // Quando o FileReader terminar de ler o arquivo, carregue a imagem no canvas
      reader.onload = function(event) {
        document.getElementById("inputs").innerHTML=""
        const image = new Image();
        imgPreview.src = event.target.result;
        imgOriginal.src = event.target.result;
        image.src = event.target.result;
        image.onload = function() {
          canvas.width = image.width;
          canvas.height = image.height;
          cnvEdited.width = image.width;
          cnvEdited.height = image.height;
          initied()
          const ctx = canvas.getContext('2d');
          ctx.drawImage(image, 0, 0, image.width, image.height);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const pixels = imageData.data;
  
          // Crie um objeto ou array para armazenar todas as cores
          const cores = {};
        
          // Itere por todos os pixels e adicione as cores ao objeto ou array
          for (let i = 0; i < pixels.length; i += 4) {
            // pixels[i] é o valor vermelho do pixel
            // pixels[i + 1] é o valor verde do pixel
            // pixels[i + 2] é o valor azul do pixel
            // pixels[i + 3] é o valor alfa do pixel
        
            // Crie uma string para representar a cor atual
            const cor = `${pixels[i]},${pixels[i + 1]},${pixels[i + 2]}`;
        
            // Adicione a cor ao objeto ou array, se ainda não existir
            if (!cores[cor]) {
              cores[cor] = {
                r: pixels[i],
                g: pixels[i + 1],
                b: pixels[i + 2]
              };
            }
          }
          // Agora você pode executar o código para manipular as cores da imagem
          Object.keys(cores).forEach(function(key) {
            let inputColor = document.createElement('input')
            inputColor.setAttribute("type","color")
            inputColor.className = "ipp"
            inputColor.setAttribute("value",`${rgbToHex(key)}`)
            inputColor.oninput = function(e){
                lastInput = e.target
                const colorKey = key
                thisColor = hexToRgb(e.target.value)
                cores[colorKey] = thisColor
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
       
                // Percorremos todos os pixels da imagem
                for (let i = 0; i < imageData.data.length; i += 4) {
                  const r = imageData.data[i];
                  const g = imageData.data[i + 1];
                  const b = imageData.data[i + 2];
              
                  // Encontramos a cor correspondente no objeto 'cores'
                  const colory = `${r},${g},${b}`;
                  const hex = cores[colory];
              
                  // Convertemos a cor para RGB novamente
                


                  // Atualizamos as informações de cor do pixel modificado
                  imageData.data[i] = hex.r;
                  imageData.data[i + 1] = hex.g;
                  imageData.data[i + 2] = hex.b;
                }
                
                // Atualizamos a imagem do segundo canvas com as informações de cor modificadas
                editedCtx.putImageData(imageData, 0, 0);
                imgPreview.src = cnvEdited.toDataURL();
            }
            document.getElementById("inputs").appendChild(inputColor)
            inputColor.onclick = function(e){
                e.preventDefault()
                lastInput = e.target
                document.getElementById("color").value = e.target.value
                let ipts = document.getElementsByClassName("ipp")
                for (let index = 0; index < ipts.length; index++) {
                    const element = ipts[index];
                    element.style.outline= "none"
                }
                lastInput.style.outline="solid 2px var(--primary)"
            }
        });
        lastInput = document.getElementsByClassName("ipp")[0]
        lastInput.style.outline="solid 2px var(--primary)"
          // usando o exemplo de código que eu mostrei antes
        }
      }
    }
  });
  function rgbToHex(rgbString) {
    const rgbArray = rgbString.split(',');
    const r = parseInt(rgbArray[0]);
    const g = parseInt(rgbArray[1]);
    const b = parseInt(rgbArray[2]);
    
    let hex = ((r << 16) | (g << 8) | b).toString(16);
    while (hex.length < 6) {
      hex = '0' + hex;
    }
    return '#' + hex;
  }
  function hexToRgb(hex) {
    // Verifica se o valor é uma string e se é válido
    if (typeof hex !== 'string' || !/^#[0-9A-Fa-f]{6}$/i.test(hex)) {
      return null;
    }

    // Converte o valor hexadecimal em três valores decimais
    const r = parseInt(hex.substring(1, 3), 16);
    const g = parseInt(hex.substring(3, 5), 16);
    const b = parseInt(hex.substring(5, 7), 16);


    // Retorna os valores decimais como um objeto RGB
    return {
      r: r,
      g: g,
      b: b
    };
  }
document.getElementById("color").oninput = (e)=>{ change(e.target.value)}
function change(color){
    console.log(color)
    lastInput.value = color
    const event = new Event('input');
    lastInput.dispatchEvent(event);
}
document.getElementById("picker").onclick = function(){
    document.getElementById("color").click()
}
function initied(){
    document.getElementById("prev").style.display="flex"
    document.getElementById("upload").style.display="none"
    document.getElementById("uploadNew").style.display="inline"
    document.getElementById("download").style.display="inline"
    document.getElementById("picker").style.display="inline"
    document.getElementById("uploadPallete").style.display="inline"
}
function uploadNew(){
    inputFile.click()

}
let alfabet = "1qw2ert4yuipa54sdfg446hjkl546çzx3cv7b6nm"
document.getElementById("uploadNew").onclick = uploadNew


document.getElementById("download").onclick = function(){
    let link = document.createElement('a') 
    link.download='changepalette_'+ alfabet[Math.floor(Math.random()*(alfabet.length-1))]+ alfabet[Math.floor(Math.random()*(alfabet.length-1))]
    link.href =  link.href=cnvEdited.toDataURL()
    link.click()
}


