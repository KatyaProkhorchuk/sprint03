import numpy as np
import scipy.stats as sps
from flask import Flask, render_template, request,jsonify
def block_average(tmp):
    n=len(tmp)
    sum=np.sum(tmp)
    print(tmp,n)
    return sum/n
def average_string(arr,n_arr):
    res=[]
    for i in range(n_arr[0]):
        sum=0
        for j in range(n_arr[1]):
            sum+=arr[i*n_arr[1]+j]
        res.append(sum/n_arr[1])
    for i in range(n_arr[0]):
        arr.append(res[i])
    return arr
def average_column(result,count_nm):
    res=[]
    for i in range(count_nm[1]):
        sum=0
        for j in range(count_nm[0]):
            sum+=result[i+j*count_nm[1]]
        res.append(sum/count_nm[0])
    for i in range(count_nm[1]):
        result.append(res[i])
    return result
def global_average(result,count_nm):
    res=0
    n=count_nm[0]*count_nm[1]
    sum=0
    for i in range(n):
        sum+=result[i]
    return sum/n
def table2(result,count_nm,count_arr,arr,alpha):
    res=[]
    count=0
    n=count_nm[0]*count_nm[1]
    # ------фактор А-----------
    # сумма квадратов отклонений
    sum=0
    for i in range(count_nm[1]):
        sum+=(result[n+count_nm[0]+i]-result[n+count_nm[0]+count_nm[1]])**2
    res.append(sum*count_nm[0]*count_arr[0])
    count+=1
    # число степеней свободы
    res.append(count_nm[1]-1)
    # print('')
    count+=1
    # исправленные дисперсии
    res.append(res[0]/res[1])
    count+=1
    # ------фактор B-----------
    # сумма квадратов отклонений
    sum = 0
    for i in range(count_nm[0]):
        sum += (result[n + i] - result[n+count_nm[0]+count_nm[1]]) ** 2
    res.append(sum * count_nm[1]*count_arr[0])
    count += 1
    # число степеней свободы
    res.append(count_nm[0] - 1)
    count += 1
    # исправленные дисперсии
    res.append(res[3] / res[4])
    count += 1
    # -одновременное влияние факторов А и В-----------
    # сумма квадратов отклонений
    sum = 0
    for i in range(count_nm[0]):
        for j in range(count_nm[1]):
            sum+=(result[i*count_nm[1]+j]-result[n+count_nm[0]+j]-result[n+i]+result[n+count_nm[0]+count_nm[1]])**2
            print(result[i*count_nm[1]+j],result[n+count_nm[0]+j],result[n+i],result[n+count_nm[0]+count_nm[1]])
    print(sum)
    res.append(sum * count_arr[0])
    count += 1
    # число степеней свободы
    res.append((count_nm[0]-1)*(count_nm[1]-1))
    count += 1
    # исправленные дисперсии
    res.append(res[6] / res[7])
    count += 1
    # -влияние случайных факторов-----------
    # сумма квадратов отклонений
    sum = 0
    id=0
    for i in range(n):
        for j in range(count_arr[0]):
            sum+=(arr[id]-result[i])**2
            id+=1
    res.append(sum)
    count += 1
    # число степеней свободы
    res.append(count_arr[0]*n-count_nm[0]*count_nm[1])
    count += 1
    # исправленные дисперсии
    res.append(res[9] / res[10])
    count += 1
    # -общая дисперсия-----------
    # сумма квадратов отклонений
    sum = 0
    id = 0
    for i in range(n):
        for j in range(count_arr[0]):
            sum += (arr[id] - result[n+count_nm[0]+count_nm[1]]) ** 2
            id += 1
    res.append(sum)
    count += 1
    # число степеней свободы
    res.append(count_arr[0]*n - 1)
    count += 1
    # исправленные дисперсии
    res.append(res[12] / res[13])
    count += 1
    # Fa
    Fa=res[2]/res[11]
    res.append(Fa)
    count+=1
    # # Fb
    Fb=res[5]/res[11]
    res.append(Fb)
    count+=1
    # # Fab
    Fab=res[8]/res[11]
    res.append(Fab)
    count+=1
    res.append(sps.f.isf(alpha,res[1],res[10]))
    count+=1
    res.append(sps.f.isf(alpha, res[4], res[10]))
    count += 1
    res.append(sps.f.isf(alpha, res[7], res[10]))
    count += 1
    for i in range(count):
        result.append(res[i])
    print(result)
    return result
app = Flask(__name__)
x=0
y=0
A=0

@app.route('/')
def index():
    return render_template("index.html")
@app.route('/solution',methods=['POST'])
def mediana():
    asJSON = request.get_json();
    count_nm=np.array(asJSON['count_nm'])
    count_arr =np.array(asJSON['count_arr'])
    count_nm = [int(el) for el in count_nm]
    count_arr = [int(el) for el in count_arr]
    arr =np.array(asJSON['arr'])
    arr = [float(el) for el in arr]
    level_a=float(asJSON['level'])
    print('arr=',arr)
    nm=count_nm[0]*count_nm[1]
    sum=0
    print('nm=',nm)
    print('count_arr',count_arr)
    result=[]
    for i in range(nm):
        tmp=[]
        for j in range(count_arr[i]):
            tmp.append(arr[j+sum])
        sum+=count_arr[i]
        result.append(block_average(tmp))
    result=average_string(result,count_nm)
    print('string',result)
    result=average_column(result,count_nm)
    print('column',result)
    result.append(global_average(result,count_nm))
    print('global',result)
    result=table2(result,count_nm,count_arr,arr,level_a)
    print(result)
    return jsonify(result)


if __name__ == "__main__":
    app.run(debug=True)
