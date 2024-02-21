precision mediump float;
uniform float u_time;
uniform vec2 u_resolution;

/////// NUMBER SYSTEM AND OPERATIONS
struct Real{
    float value;
};

struct Imaginary{
    float value;
};

struct Complex{
    Real realValue;
    Imaginary imaginaryValue;
};

// Complex squareComplex(Complex complex){
//     float biSquared = complex.imaginaryValue.value * complex.imaginaryValue.value;
    
//     Real realComponent = Real(complex.realValue.value * complex.realValue.value - biSquared);
//     Imaginary imaginaryComponent = Imaginary(complex.imaginaryValue.value * complex.realValue.value * 2.);
//     // return Complex(Real(biSquared),imaginaryComponent);
//     return Complex(realComponent,imaginaryComponent);
// }

Complex addComplex(Complex a, Complex b){
    Real realComponent = Real(a.realValue.value + b.realValue.value);
    Imaginary imaginaryComponent = Imaginary(a.imaginaryValue.value + b.imaginaryValue.value);
    return Complex(realComponent, imaginaryComponent);
}

Complex subtractComplex(Complex a, Complex b){
    Real realComponent = Real(a.realValue.value - b.realValue.value);
    Imaginary imaginaryComponent = Imaginary(a.imaginaryValue.value - b.imaginaryValue.value);
    return Complex(realComponent, imaginaryComponent);
}

Complex multiplyComplex(Complex a, Complex b){
    Real real = Real(a.realValue.value * b.realValue.value - (a.imaginaryValue.value * b.imaginaryValue.value)); 
    Imaginary imaginary = Imaginary(a.imaginaryValue.value * b.realValue.value + a.realValue.value * b.imaginaryValue.value);
    return Complex(real,imaginary);
}

Complex powComplex(Complex c, int p){
    Real real;
    Imaginary imaginary;
    Complex result = Complex(Real(1.),Imaginary(1.));
    if (c.realValue.value > 0.){
        real = Real(1.);
    } else real = Real(0.);

    if (c.imaginaryValue.value > 0.){
        imaginary = Imaginary(1.);
    } else imaginary = Imaginary(0.);

    for(int i = 0; i<5; i++){
        if (i >= p){
            break;
        }
        result = multiplyComplex(result, c);
    } 
    return result;
}

Complex negate(Complex c){
    return Complex(Real(-1. * c.realValue.value), Imaginary(-1. * c.imaginaryValue.value));
}

Complex conjugate(Complex c){
    return Complex(c.realValue, Imaginary(c.imaginaryValue.value * -1.));
}

Complex divideComplex(Complex a, Complex b){
    Complex conjugate = conjugate(b);
    Complex numerator = multiplyComplex(a,conjugate);
    Complex denominator = multiplyComplex(b, conjugate);
    Complex result = Complex(
        Real(numerator.realValue.value / denominator.realValue.value),
        Imaginary(numerator.imaginaryValue.value / denominator.realValue.value)
    );
    return result;
}

float complexLength(Complex complex){
    vec2 vec =  vec2(abs(complex.realValue.value),abs(complex.imaginaryValue.value));
    return length(vec);
}

float complexDistance(Complex a, Complex b){
    Complex dist = subtractComplex(a,b);
    return complexLength(dist);
}

Complex createComplex(float real, float imaginary){
    return Complex(Real(real),Imaginary(imaginary));
}

//////// ALGERBA
//a root is a representation of x-c, so when you multiply roots, 
// you return (x-c1)(x-c2) = x^2 + -(c1+c2) + c1c2
struct Root{
    Complex c;
};

struct Term{
    Complex c;
    int degree;
};

// maximum is quintic, uses constants in front of powers of x instead of the roots themselves
struct Polynomial{
    Term leading;
    Term x4;
    Term x3;
    Term x2;
    Term x;
    Term constant;
    int degree;
};

Complex emptyComplex(){
    return Complex(Real(0.),Imaginary(0.));
}

Term emptyTerm(int power){
    return Term(emptyComplex(),power);
}

Polynomial emptyPolynomial(){
    return Polynomial(
        emptyTerm(5),
        emptyTerm(4),
        emptyTerm(3),
        emptyTerm(2),
        emptyTerm(1),
        emptyTerm(0),
        0
    );
}

// int getDegree(Polynomial p){
//     return p.degree;
// }

Polynomial setDegree(Polynomial p){
    // Polynomial p = emptyPolynomial();
    if (p.degree > 5 || p.degree < 0){
        p.degree = -1;
        return p;
    }

    if (p.leading.c.realValue.value != 0. || p.leading.c.imaginaryValue.value != 0.){
        p.degree = 5;
        return p;
    }
    else if (p.x4.c.realValue.value != 0. || p.x4.c.imaginaryValue.value != 0.){
        p.degree = 4;
        return p;
    }
    else if (p.x3.c.realValue.value != 0. || p.x3.c.imaginaryValue.value != 0.){
        p.degree = 3;
        return p;
    }
    else if (p.x2.c.realValue.value != 0. || p.x2.c.imaginaryValue.value != 0.){
        p.degree = 2;
        return p;
    }
    else if (p.x.c.realValue.value != 0. || p.x.c.imaginaryValue.value != 0.){
        p.degree = 1;
        return p;  
    }
    else{
        p.degree = 0;
        return p;
    }
}

Term getTerm(Polynomial p, int degree){
    if (degree > 5 || degree < 0){
        return emptyTerm(-1);
    }

    if (degree == 5){
        return p.leading;
    }
    if (degree == 4){
        return p.x4;
    }
    if (degree == 3){
        return p.x3;
    }
    if (degree == 2){
        return p.x2;
    }
    if (degree == 1){
        return p.x;
    }
    if (degree == 0){
        return p.constant;
    }
}

Polynomial setTerm(Polynomial p, Term t){
    if (t.degree > 5 || t.degree < 0){
        return p;
    }

    if (t.degree == 5){
        p.leading = t;
        p = setDegree(p);
        return p;
    }
    if (t.degree == 4){
        p.x4 = t;
        p = setDegree(p);
        return p;
    }
    if (t.degree == 3){
        p.x3 = t;
        p = setDegree(p);
        return p;
    }
    if (t.degree == 2){
        p.x2 = t;
        p = setDegree(p);
        return p;
    }
    if (t.degree == 1){
        p.x = t;
        p = setDegree(p);
        return p;
    }
    if (t.degree == 0){
        p.constant = t;
        p = setDegree(p);
        return p;
    }
}

// Polynomial addTerms(Term a, Term b){
//     Term term;
//     Polynomial polynomial = emptyPolynomial();
//     if (a.degree == b.degree){
//         term = Term(addComplex(a.c,b.c),a.degree);
//     }

//     setTerm(polynomial, term);
//     polynomial = setDegree(polynomial);
//     return polynomial;
// }

// Polynomial rootToPolynomial(Root root){
//     Polynomial p = emptyPolynomial();
//     Term x = Term(Complex(Real(1.),Imaginary(0.)),1);
//     Term C = Term(negate(root.c),0);
    
//     p = setTerm(p,x);
//     p = setTerm(p,C);
//     p = setDegree(p);
//     return p;
// }

Polynomial termToPolynomial(Term t){
    Polynomial p = emptyPolynomial();
    p = setTerm(p,t);
    p = setDegree(p);
    return p;
}

Polynomial addPolynomials(Polynomial a, Polynomial b){
    Polynomial sum = emptyPolynomial();
    for (int i = 0; i < 5; i ++){
        Term termA = getTerm(a,i);
        Term termB = getTerm(b,i);
        Term termSum = Term(addComplex(termA.c,termB.c),i);
        sum = setTerm(sum,termSum);
    }
    sum = setDegree(sum);
    return sum;
}

//multiply (x-a)(x-b)
Polynomial multiplyRoots(Root a, Root b){
    Term leading = Term(Complex(Real(1.),Imaginary(0.)),2);
    Term middle = Term(negate(addComplex(a.c,b.c)),1);
    Term constant = Term(multiplyComplex(negate(a.c),negate(b.c)), 0);

    Polynomial p = emptyPolynomial();
    p = addPolynomials(p,termToPolynomial(leading));
    p = addPolynomials(p,termToPolynomial(middle));
    p = addPolynomials(p,termToPolynomial(constant));
    p = setDegree(p);
    return p;
}


Polynomial multiplyPolynomial(Polynomial a, Root b){    
    Polynomial p = emptyPolynomial();

    Polynomial firstOperation = emptyPolynomial();
    for (int i = 5; i >= 0; i--){
        Term product = getTerm(a,i);
        product.degree += 1;//multiplication by x
        firstOperation = setTerm(firstOperation,product); 
    }
    Polynomial secondOperation = emptyPolynomial();
    for (int i = 5; i >= 0; i--){
        Term product = Term(multiplyComplex(negate(b.c), getTerm(a,i).c),i);
        secondOperation = setTerm(secondOperation, product);
    }

    p = addPolynomials(firstOperation, secondOperation);
    p = setDegree(p);
    return p;
}

Term powerRule(Term t){
    if (t.degree == 0){
        return emptyTerm(-1);// since setTerm doesnt take values below 0, this will be fine
    }
    Complex scalar = emptyComplex();
    scalar.realValue.value = float(t.degree);
    Term new = Term(multiplyComplex(t.c, scalar), t.degree - 1);
    
    return new;
}

Polynomial Differentiate(Polynomial p){
    Polynomial derivative = emptyPolynomial();
    p.leading = emptyTerm(5);
    for (int i = 5; i >= 0; i--){
        Term term = getTerm(p,i);
        term = powerRule(term);
        derivative = setTerm(derivative,term);
    }
    return derivative;
}

// Polynomial createPolynomial(Root a){
//     return rootToPolynomial(a);
// }
// Polynomial createPolynomial(Root a, Root b){
//     return multiplyRoots(a,b);
// }
// Polynomial createPolynomial(Root a, Root b, Root c){
//     return (multiplyPolynomial(multiplyRoots(a,b),c));
// }
Polynomial createPolynomial(Root a, Root b, Root c, Root d){
    return multiplyPolynomial(multiplyPolynomial(multiplyRoots(a,b),c),d);
}

Polynomial createPolynomial(Root a, Root b, Root c, Root d, Root e){
    return multiplyPolynomial(multiplyPolynomial(multiplyPolynomial(multiplyRoots(a,b),c),d),e);
}
Root createRoot(float real, float imaginary){
    return Root(Complex(Real(real),Imaginary(imaginary)));
}

Complex evaluateTerm(Term t, Complex c){
    return multiplyComplex(t.c,powComplex(c,t.degree));
}

Complex evaluate(in Polynomial p, Complex c){
    Complex sum = emptyComplex();
    for (int i = 5; i >= 0; i--){
        sum = addComplex(sum, evaluateTerm(getTerm(p,i),c));
    }
    return sum;
}

vec3 rgb(int r, int g, int b){
    return vec3(float(r)/255., float(g)/255., float(b)/255. );
}

Complex lerp(Complex a, Complex b, float t){
    t = clamp(t,0.,1.);
    Complex diff = subtractComplex(b,a);
    // Complex scalar = Complex(
    //     Real(t),
    //     Imaginary(0.)
    // );
    Complex scalar = createComplex(
        diff.realValue.value * t,
    // diff.imaginaryValue.value * t
        0.
    );

    Complex result = createComplex(
        a.realValue.value + diff.realValue.value * t,
        a.imaginaryValue.value + diff.imaginaryValue.value * t
    );

    return result;

    return addComplex(multiplyComplex(diff,scalar),a);
}

Complex bezier2(Complex start, Complex s1, Complex end, float t){
    Complex inter01 = lerp(start,s1,t);
    Complex inter02 = lerp(s1,end,t);
    Complex inter11 = lerp(inter01,inter02,t);
    return inter11;
}

Complex bezier3(Complex start, Complex s1, Complex s2, Complex end, float t){
    Complex inter01 = lerp(start,s1,t);
    Complex inter02 = lerp(s1,s2,t);
    Complex inter03 = lerp(s2,end,t);

    Complex inter11 = lerp(inter01,inter02,t);
    Complex inter12 = lerp(inter02,inter03,t);

    Complex inter21 = lerp(inter11, inter12,t);
    return inter21;
}

vec3 NewtonsMethod(Complex complexCoord, Root a, Root b, Root c, Root d, Root e){
    Polynomial P = createPolynomial(a,b,c,d,e);
    P = createPolynomial(b,c,d,e);
    // P = createPolynomial(a,b,c);

    vec3 colorA = rgb(113,128,172);
    vec3 colorB = rgb(43,69,112);
    vec3 colorC = rgb(168,208,219);
    vec3 colorD = rgb(228,146,115);
    vec3 colorE = rgb(163,122,116);

    const int iterationLimit = 20;
    Complex z = complexCoord;
    for (int i = 0; i < iterationLimit; i++){
        z = subtractComplex(z,divideComplex(
            evaluate(P,z),
            evaluate(Differentiate(P),z)
        ));
    }

    // z = evaluate(P,z);
    
    // float distA = complexLength(subtractComplex(z,a.c));
    float distB = complexLength(subtractComplex(z,b.c));
    float distC = complexLength(subtractComplex(z,c.c));
    float distD = complexLength(subtractComplex(z,d.c));
    float distE = complexLength(subtractComplex(z,e.c));
    // float minDist = min(min(min(distA,distB),distC),distD);
    float minDist = min(min(min(distB,distC),distD),distE);
    int num = 0xff;
    // float minDist = min(min(min(min(distA,distB),distC),distD),distE);

    // if (minDist == distA){
    //     return colorA;
    // }
    // else 
    if (minDist == distB){
        return colorB;
    }
    else if(minDist == distC){
        return colorC;
    }
    else if(minDist == distD){
        return colorD;
    }
    else if (minDist == distE){
        return colorE;
    }

    // return vec3(z.realValue.value, z.imaginaryValue.value,0);
}

vec3 graph(vec2 uv){
    Complex complexCoord = Complex(Real(uv.x),Imaginary(uv.y));

    Root a = createRoot(6.0,0.0);

    // Root b = createRoot(-6.,-3.0);
    Root b = createRoot(-6.,-3.0 - sin(u_time));

    // Root c = createRoot(-6.,3.0);
    Root c = createRoot(-6.,3.0 + 1.1 * sin( 0.5 * u_time));
    

    // Root d = createRoot(2.,4.);
    Root d = createRoot(2. + 2. * cos(u_time * 0.5),4. - sin(u_time * 2.));

    // Root e = createRoot(2.,-4.);
    Root e = createRoot(
        d.c.realValue.value + 5. * cos(u_time),
        d.c.imaginaryValue.value + 5. * sin(u_time)
    );

    // Root e = createRoot(2. + 2. * cos(u_time * 0.6),-4. + sin(u_time * 0.3));

    // Root c = createRoot(
    //     e.c.realValue.value + 7. * cos(u_time * 1.5),
    //     e.c.imaginaryValue.value + 7. * sin(u_time * 1.5)
    // );

    // b.c = lerp(
    //     createComplex(-6.,-3.0),
    //     createComplex(-6.,3.0),
    //     abs(sin(u_time))
    // );

    b.c = bezier3(
        // createComplex(-6.,-3.0),
        createComplex(sin(1.1 * u_time)*sin(u_time), cos(u_time * 0.9)),
        e.c,
        d.c,
        addComplex(c.c, createComplex(sin(u_time),cos(u_time))),
        abs(sin(u_time))
    );

    c.c = bezier2(
        addComplex(e.c, createComplex(5. * sin(u_time), 4.5 * cos(u_time * 0.6))),
        d.c,
        addComplex(b.c,createComplex(sin(-u_time), 3. * cos(u_time)*cos(0.8 * u_time))),
        abs(sin(u_time * 0.6))
    );

    // b.c = lerp(
    //     createComplex(-1.,0.),
    //     createComplex(1.0,0.),
    //     sin(u_time)
    // );

    if (complexDistance(complexCoord,emptyComplex()) < 0.2){
        return vec3(1.0, 0.4706, 0.4706);
    }
    // if (complexDistance(complexCoord,a.c) < 0.1){
    //     return vec3(1,1,1);
    // }
    if (complexDistance(complexCoord,b.c) < 0.1){
        return vec3(1,1,1);
    }
    if (complexDistance(complexCoord,c.c) < 0.1){
        return vec3(1,1,1);
    }    
    if (complexDistance(complexCoord,d.c) < 0.1){
        return vec3(1,1,1);
    }    
    if (complexDistance(complexCoord,e.c) < 0.1){
        return vec3(1,1,1);
    }

    return NewtonsMethod(complexCoord, a,b,c,d,e);
    // return NewtonsMethod(complexCoord,P);
}

void main(){
    vec2 uv = vec2(2. * (gl_FragCoord.xy/ u_resolution)-1.);

    float graphScale = 20.;
    vec2 cameraPos = vec2(-0,0.025);
    //* (1./exp(0.4 * u_time))
    vec2 cameraView = (graphScale * (1./exp(0.4 * u_time))) * uv + cameraPos;
    cameraView = (graphScale) * uv + cameraPos;
    vec3 color = graph(cameraView);

    gl_FragColor = vec4(color,1.);
}

//COLORS
/*
    mechanical keyboard / navy blue, teal, brown, orange
    vec3 colorA = rgb(113,128,172);
    vec3 colorB = rgb(43,69,112);
    vec3 colorC = rgb(168,208,219);
    vec3 colorD = rgb(228,146,115);
    vec3 colorE = rgb(163,122,116);

    wines
    vec3 colorA = rgb(91,35,51);
    vec3 colorB = rgb(247,244,243);
    vec3 colorC = rgb(86,77,74);
    vec3 colorD = rgb(242,67,51);
    vec3 colorE = rgb(186,27,29);

    https://coolors.co/e2d4b7-9c9583-a1a499-b0bbbf-cadbc8
    vec3 colorA = rgb(226,212,183);
    vec3 colorB = rgb(156,149,131);
    vec3 colorC = rgb(161,164,153);
    vec3 colorD = rgb(176,187,191);
    vec3 colorE = rgb(202,219,200);

    https://coolors.co/5b507a-5b618a-9eadc8-b9e28c-d6d84f

    https://coolors.co/818d92-586a6a-b9a394-d4c5c7-dad4ef

    https://coolors.co/040f0f-248232-2ba84a-2d3a3a-fcfffc

    https://coolors.co/131515-2b2c28-339989-7de2d1-fffafb

    https://coolors.co/f46036-5b85aa-414770-372248-171123
*/