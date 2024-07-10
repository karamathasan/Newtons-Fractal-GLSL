# Explanation

## Newton's method
Newton's method is an algorithm used to find the roots of a polynomial. After choosing a value of x<sub>0</sub> as the input to the polynomial, take the tangent line to the polynomial at x<sub>0</sub> and then find its x-intercept.
This new value can be called x<sub>1</sub>. Repeating the same steps for x<sub>1</sub> and its further outputs will approach the roots of the polynomial. In general, x<sub>n+1</sub> = x<sub>n</sub> - (f(x<sub>n</sub>)/f'(x<sub>n</sub>)).

This also algorithm applies to polynomials with complex roots. 
A notable feature of Newton's method is that there are points of instability that may where points close by an input may result in finding a different root from that input. 
In the complex plane, this resembles a Voronoi diagram, with a fractal emerging at the boundaries.

This code is an animation made to demonstrate the fractal that emerges in the complex plane with moving roots
