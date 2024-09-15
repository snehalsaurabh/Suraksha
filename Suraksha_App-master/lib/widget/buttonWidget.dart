import 'package:flutter/material.dart';

class buttonWidget extends StatelessWidget {
  final String label;
  final Color colour;
  final TextStyle textstyle;
  final VoidCallback onPressed;
  final RoundedRectangleBorder shape;
  final EdgeInsets padding;

  buttonWidget({
    Key? key,
    required this.label,
    required this.colour,
    required this.onPressed,
    required this.textstyle,
    required this.shape,
    required this.padding,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 16.0),
      child: Material(
        elevation: 5.0,
        color: colour,
        borderRadius: BorderRadius.circular(30.0),
        child: MaterialButton(
          onPressed: onPressed,
          minWidth: 200.0,
          height: 42.0,
          child: Text(
            label,
            style: textstyle,
          ),
        ),
      ),
    );
  }
}
