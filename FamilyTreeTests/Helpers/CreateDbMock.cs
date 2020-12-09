using System;
using System.Collections.Generic;
using System.Text;
using Moq;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace FamilyTreeTests.Helpers
{
    static class CreateDbMock
    {
        public static Mock<DbSet<T>> Create<T>(IEnumerable<T> list) where T : class
        {
            var LinqList = list.AsQueryable();
            var MocketDbSet = new Mock<DbSet<T>>();

            MocketDbSet.As<IQueryable<T>>().Setup(m => m.Provider).Returns(LinqList.Provider);
            MocketDbSet.As<IQueryable<T>>().Setup(m => m.Expression).Returns(LinqList.Expression);
            MocketDbSet.As<IQueryable<T>>().Setup(m => m.ElementType).Returns(LinqList.ElementType);
            MocketDbSet.As<IQueryable<T>>().Setup(m => m.GetEnumerator()).Returns(LinqList.GetEnumerator());

            return MocketDbSet;
        }
    }
}
