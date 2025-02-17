from flask import Flask, request, jsonify
from basic_math import add, subtract, multiply, divide
from calculus import differentiate, integrate

app = Flask(__name__)

@app.route('/add', methods=['POST'])
def add_route():
    data = request.get_json()
    result = add(data['a'], data['b'])
    return jsonify(result=result)

@app.route('/subtract', methods=['POST'])
def subtract_route():
    data = request.get_json()
    result = subtract(data['a'], data['b'])
    return jsonify(result=result)

@app.route('/multiply', methods=['POST'])
def multiply_route():
    data = request.get_json()
    result = multiply(data['a'], data['b'])
    return jsonify(result=result)

@app.route('/divide', methods=['POST'])
def divide_route():
    data = request.get_json()
    result = divide(data['a'], data['b'])
    return jsonify(result=result)

@app.route('/differentiate', methods=['POST'])
def differentiate_route():
    data = request.get_json()
    result = differentiate(data['expression'], data['variable'])
    return jsonify(result=str(result))

@app.route('/integrate', methods=['POST'])
def integrate_route():
    data = request.get_json()
    result = integrate(data['expression'], data['variable'])
    return jsonify(result=str(result))

if __name__ == '__main__':
    app.run(debug=True)
