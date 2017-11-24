const analyze = document.querySelector(".analyze");
analyze.addEventListener('click',()=>{
    let twitter = document.getElementById("twitter").value;
    let Quora = document.getElementById("quora").value;
    let Else = document.getElementById("else").value;
    document.write(`${twitter} , ${Quora}, ${Else}`);
});;
