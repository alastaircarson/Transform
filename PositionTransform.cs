using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Geom.Transform
{
    /// <summary>
    /// Summary description for PositionTransform
    /// </summary>
    public class Position
    {
        public double x;
        public double y;

        public Position(double x, double y)
        {
            this.x = x;
            this.y = y;
        }

        public string AsWktPoint()
        {
            return "POINT(" + x.ToString() + " " + y.ToString() + ")";
        }
    }

    public class PositionTransform
    {
        protected double[,] m_data;

        public PositionTransform()
        {
            m_data = new double[3, 3];
            //	Set up identity matrix
            for (int a = 0; a < 3; a++)
            {
                for (int b = 0; b < 3; b++)
                {
                    m_data[a, b] = 0.0;
                }
                m_data[a, a] = 1.0;
            }
        }

        public PositionTransform combine(PositionTransform by)
        {
            PositionTransform result = new PositionTransform();
            //	This is a matrix multiply
            result.m_data[0, 0] = m_data[0, 0] * by.m_data[0, 0] + m_data[0, 1] * by.m_data[1, 0] + m_data[0, 2] * by.m_data[2, 0];
            result.m_data[0, 1] = m_data[0, 0] * by.m_data[0, 1] + m_data[0, 1] * by.m_data[1, 1] + m_data[0, 2] * by.m_data[2, 1];
            result.m_data[0, 2] = m_data[0, 0] * by.m_data[0, 2] + m_data[0, 1] * by.m_data[1, 2] + m_data[0, 2] * by.m_data[2, 2];
            result.m_data[1, 0] = m_data[1, 0] * by.m_data[0, 0] + m_data[1, 1] * by.m_data[1, 0] + m_data[1, 2] * by.m_data[2, 0];
            result.m_data[1, 1] = m_data[1, 0] * by.m_data[0, 1] + m_data[1, 1] * by.m_data[1, 1] + m_data[1, 2] * by.m_data[2, 1];
            result.m_data[1, 2] = m_data[1, 0] * by.m_data[0, 2] + m_data[1, 1] * by.m_data[1, 2] + m_data[1, 2] * by.m_data[2, 2];
            result.m_data[2, 0] = m_data[2, 0] * by.m_data[0, 0] + m_data[2, 1] * by.m_data[1, 0] + m_data[2, 2] * by.m_data[2, 0];
            result.m_data[2, 1] = m_data[2, 0] * by.m_data[0, 1] + m_data[2, 1] * by.m_data[1, 1] + m_data[2, 2] * by.m_data[2, 1];
            result.m_data[2, 2] = m_data[2, 0] * by.m_data[0, 2] + m_data[2, 1] * by.m_data[1, 2] + m_data[2, 2] * by.m_data[2, 2];
            return result;
        }

        public Position TransformPosition(Position pos)
        {
            Position translated = new Position(0, 0);
            translated.x = pos.x * m_data[0, 0] + pos.y * m_data[0, 1] + m_data[0, 2];
            translated.y = pos.x * m_data[1, 0] + pos.y * m_data[1, 1] + m_data[1, 2];
            return translated;
        }
    }

    public class Shift : PositionTransform
    {
        public Shift(double xOffset, double yOffset)
        {
            m_data[0, 0] = 1.0;
            m_data[0, 1] = 0.0;
            m_data[0, 2] = xOffset;
            m_data[1, 0] = 0.0;
            m_data[1, 1] = 1.0;
            m_data[1, 2] = yOffset;
            m_data[2, 0] = 0.0;
            m_data[2, 1] = 0.0;
            m_data[2, 2] = 1.0;
        }
    }

    public class Scale : PositionTransform
    {
        public Scale(double scale)
        {
            //	Cannot Change the Aspect Ratio. 
            m_data[0, 0] = scale;
            m_data[0, 1] = 0.0;
            m_data[0, 2] = 0.0;
            m_data[1, 0] = 0.0;
            m_data[1, 1] = scale;
            m_data[1, 2] = 0.0;
            m_data[2, 0] = 0.0;
            m_data[2, 1] = 0.0;
            m_data[2, 2] = 1.0;
        }
    }

    public class Rotate : PositionTransform
    {
        public Rotate(double rads)
        {
            m_data[0, 0] = Math.Cos(rads);
            m_data[0, 1] = -Math.Sin(rads);
            m_data[0, 2] = 0.0;
            m_data[1, 0] = Math.Sin(rads);
            m_data[1, 1] = Math.Cos(rads);
            m_data[1, 2] = 0.0;
            m_data[2, 0] = 0.0;
            m_data[2, 1] = 0.0;
            m_data[2, 2] = 1.0;
        }
    }

    public class HorizontalFlip : PositionTransform
    {
        public HorizontalFlip()
        {
            m_data[0, 0] = 1.0;
            m_data[0, 1] = 0.0;
            m_data[0, 2] = 0.0;
            m_data[1, 0] = 0.0;
            m_data[1, 1] = -1.0;
            m_data[1, 2] = 0.0;
            m_data[2, 0] = 0.0;
            m_data[2, 1] = 0.0;
            m_data[2, 2] = 1.0;
        }
    }
}

