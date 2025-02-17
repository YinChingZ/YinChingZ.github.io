from sympy import symbols, diff, integrate, sympify

def differentiate(expression, variable):
    try:
        expr = sympify(expression)
        var = symbols(variable)
        return diff(expr, var)
    except Exception as e:
        return str(e)

def integrate(expression, variable):
    try:
        expr = sympify(expression)
        var = symbols(variable)
        return integrate(expr, var)
    except Exception as e:
        return str(e)
