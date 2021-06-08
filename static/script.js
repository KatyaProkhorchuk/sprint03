var count_A=0
var count_B=0
var level_a=0
var user=0
function next_1(){
count_A=document.getElementById("factor_a").value;
count_B=document.getElementById("factor_b").value;
var level_1=document.getElementById("level_1");
var level_2=document.getElementById("level_2");
if(level_1.checked)
    level_a=0.05;
else if(level_2.checked)
    level_a=0.01;
console.log(count_A)
console.log(count_B)
console.log(level_a)
if(count_A&&count_B&&level_a){
user=1
    str='<table width="100%" border="1" cellpadding="4" cellspacing="0">'
    str+='<tr><td  rowspan="2">Фактор В</td>'
    str+='<td width="100" colspan="'+count_A+'">Фактор A</td></tr><tr>'
    for (let i=1;i<=count_A;i++){
        tmp='A<sub>'+i+'</sub>'
        str+='<td>'+tmp+'</td>'
    }
    str+='</tr>'
    count=0
    for(let i=1;i<=count_B;i++){
        tmp='B<sub>'+i+'</sub>'
        str+='<tr><td>'+tmp+'</td>'
        for(let j=0;j<count_A;j++){
            str+='<td><input type="text" class="number" id="number_'+count+'"</td>'
            count+=1
        }
        str+='</tr>'

    }
    str+='</table><input type="button" name="solution" onclick="solutions()" value="Solution">'
//    console.log(str)
    document.getElementById('user_table').style.display='block';
    document.getElementById('user_table').innerHTML=str;
    document.getElementById('result').style.display='block';

    document.getElementById('automatic').style.display='none';

}
}
function automatics(){
    document.getElementById('user_table').style.display='none';

    var level_1=document.getElementById("level_1");
    var level_2=document.getElementById("level_2");
    if(level_1.checked)
        level_a=0.05;
    else if(level_2.checked)
        level_a=0.01;
    if (level_a!=0)
    document.getElementById('result').style.display='none';
    document.getElementById('automatic').style.display='block';
    user=2
}
function solutions(){
    console.log(user)
    let count_nm=[]
    let count_arr=[]
    if(user==2){//вариант
       count_nm=[2, 3];
       console.log(count_nm.length)
       count_arr=[10, 10, 10, 10, 10, 10]
       arr=[3.25, 3.45, 3.55, 4.04, 4.08, 4.2, 3.3, 3.8, 3.45, 3.25, 4.2, 3.95, 3.33, 4.1, 3.5, 3.42, 3.49, 3.59, 3.68, 3.79, 3.99, 3.89, 4.32, 4.23, 4.4, 3.29, 3.25, 3.11, 4.45, 4.05, 3.41, 3.45, 3.5, 4.45, 4.25, 4.33, 4.5, 4.29, 3.42, 3.41, 3.3, 3.42, 4.2, 4.29, 4.39, 3.8, 3.92, 3.99, 4.05, 4.11, 4.2, 3.21, 3.2, 3.11, 4.29, 4.41, 4.5, 4.48, 3.81, 4.29]
        js_a=JSON.stringify(count_nm);
        js_b=JSON.stringify(count_arr);
        js_c=JSON.stringify(arr);
        console.log(js_a)

    }else if(user==1){
        count_nm[0]=count_B
        count_nm[1]=count_A
        console.log(count_nm)
        var a=[]
        var arr=[]

        for(let i=0;i<count_A*count_B;i++){
            str='number_'+i
            A=document.getElementById(str).value
            console.log(A)
            A=A.trim()
            tmp=A.split(" ")
            console.log(tmp)
            for(let j=0;j<tmp.length;j++)
                arr.push(tmp[j])
            console.log(arr)
            a.push(tmp.length)
    }
    console.log(arr)
    console.log(a)
    c_arr=JSON.stringify(a)
    t_arr=JSON.stringify(arr)
    for (let i=0;i<count_B*count_A;i++){
        count_arr.push(a[i])
    }
//    console.log(arr)
    console.log(count_arr)
    console.log([2, 2, 2, 2])
    }
    fetch('/solution', {
            headers: {
              'Content-Type': 'application/json'
            },
            method: 'POST',
            body:JSON.stringify({
                "count_nm":count_nm,
                "count_arr":count_arr,
                "arr":arr,
                "level":level_a
            })
        }).then(function (response) { // At this point, Flask has printed our JSON
            return response.text();
        }).then(function (array) {
            console.log(array);
            array=JSON.parse(array)
            console.log(array.length);
            document.getElementById('result').style.display='block';
            str='<table width="100%" border="1" cellpadding="4" cellspacing="0">'
            str+='<tr><td rowspan="3" colspan="2">Ступінь впливу фактора В</td><td colspan="'+count_nm[1]*2+'">Ступінь впливу фактора А</td><td rowspan="3">Середня величина за рядками</td><td rowspan="3">Загальна середня</td></tr>'
            str+='<tr>'
            for (let i=1;i<=count_nm[1];i++){
                tmp='A<sub>'+i+'</sub>'
                str+='<td colspan="2">'+tmp+'</td>'
            }
            str+='</tr>'
            str+='<tr>'
            index=0
            for (let i=1;i<=count_nm[1];i++){
                str+='<td>перший рівень</td><td>блочна середня</td>'
            }str+='</tr>'
            sum=0
            for(let i=1;i<=count_nm[0];i++){
                tmp='B<sub>'+i+'</sub>'
                str+='<tr><td>'+tmp+'</td><td>'+i+' рівень</td>'
                for(let j=0;j<count_nm[1];j++){
                    tmp=''
                    for(let a=0;a<count_arr[index];a++){
                        tmp+=arr[a+sum]+'<br>'
                    }
                    str+='<td>'+tmp+'</td>'
                    str+='<td>'+array[index].toFixed(3)+'</td>'

                    sum+=count_arr[index]
                    index++
                } str+='<td>'+array[i+count_nm[0]*count_nm[1]-1].toFixed(3)+'</td>'
                if(i==1){
                        str+='<td rowspan="'+count_nm[0]+'">'+array[Number(count_nm[0])*Number(count_nm[1])+Number(count_nm[0])+Number(count_nm[1])].toFixed(3)+'</td>'
                    }
                  str+='</tr>'
            }
            str+='<tr> <td colspan="2">Середня величина за стовпцями</td>'
            console.log(array[9])
            for (let i=0;i<count_nm[1];i++){
            console.log(index)
            t=index+i+Number(count_nm[0])
            console.log(array)
            console.log(t,array[t])
                str+='<td colspan="2">'+array[t].toFixed(3)+'</td>'

            }
            str+='<td></td><td></td></tr>'
            index+=Number(count_nm[0])+Number(count_nm[1])+1
            str+='</table>'
            str+='<table>'
            str+='<tr><td> Джерело, що спонукає до розсіювання</td><td>Сумма квадратів відхилень</td><td>Число степенів свободи</td><td>Статистичні оцінки дисперсії<br>(виправлені дисперсії)</td></tr>'
            str+='<tr><td>Фактор А</td><td>'+array[index].toFixed(3)+'</td><td>'+array[index+1]+'</td><td>'+array[index+2].toFixed(3)+'</td></tr>'
            index+=3
            str+='<tr><td>Фактор B</td><td>'+array[index].toFixed(3)+'</td><td>'+array[index+1]+'</td><td>'+array[index+2].toFixed(3)+'</td></tr>'
            index+=3
            str+='<tr><td>Одночасний вплив факторів А і В</td><td>'+array[index].toFixed(3)+'</td><td>'+array[index+1]+'</td><td>'+array[index+2].toFixed(3)+'</td></tr>'
            index+=3
            str+='<tr><td>Вплив випадкових факторів</td><td>'+array[index].toFixed(3)+'</td><td>'+array[index+1]+'</td><td>'+array[index+2].toFixed(3)+'</td></tr>'
            index+=3
            str+='<tr><td>Загальна дисперсія</td><td>'+array[index].toFixed(3)+'</td><td>'+array[index+1]+'</td><td>'+array[index+2].toFixed(3)+'</td></tr>'
            str+='</table>'
            index+=3
            str+='<div class="fisher"><p>F<sup>*</sup><sub>A</sub>='+array[index].toFixed(3)+'</p>'
            index+=1
            str+='<p>F<sup>*</sup><sub>B</sub>='+array[index].toFixed(3)+'</p>'
            index+=1
            str+='<p>F<sup>*</sup><sub>AB</sub>='+array[index].toFixed(3)+'</p>'
            index+=1
            str+='<p>F<sub>кр</sub>(a='+level_a+';k<sub>1</sub>='+array[index-17]+';k<sub>2</sub>='+array[index-8]+')='+array[index].toFixed(3)+'</p>'
            index+=1
            str+='<p>F<sub>кр</sub>(a='+level_a+';k<sub>1</sub>='+array[index-15]+';k<sub>2</sub>='+array[index-9]+')='+array[index].toFixed(3)+'</p>'
            index+=1
            str+='<p>F<sub>кр</sub>(a='+level_a+';k<sub>1</sub>='+array[index-13]+';k<sub>2</sub>='+array[index-10]+')='+array[index].toFixed(3)+'</p>'

            console.log(array[index-5],array[index-2])
            if(array[index-5]>array[index-2]){
                str+='<p>F<sup>*</sup><sub>A</sub>>F<sub>кр</sub>-нульова гіпотеза про відсутність впливу фактора А відхиляється</p>'
            }
            else{
                str+='<p>F<sup>*</sup><sub>A</sub>>F<sub>кр</sub>-нульова гіпотеза про відсутність впливу фактора А не відхиляється</p>'
            }
            if(array[index-4]>array[index-1]){
                str+='<p>F<sup>*</sup><sub>В</sub>>F<sub>кр</sub>-нульова гіпотеза про відсутність впливу фактора В відхиляється</p>'
            }
            else{
                str+='<p>F<sup>*</sup><sub>В</sub>>F<sub>кр</sub>-нульова гіпотеза про відсутність впливу фактора В не відхиляється</p>'
            }
            if(array[index-3]>array[index]){
                str+='<p>F<sup>*</sup><sub>AB</sub>>F<sub>кр</sub>-нульова гіпотеза про відсутність впливу фактора B, а також сумісної дії факторів A і В відхиляється</p>'
            }
            else{
                str+='<p>F<sup>*</sup><sub>AB</sub>>F<sub>кр</sub>-нульова гіпотеза про відсутність впливу фактора B, а також сумісної дії факторів A і В не відхиляється</p></div>'
            }
            document.getElementById('result').innerHTML=str;
        });
}