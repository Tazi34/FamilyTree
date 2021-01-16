
namespace FamilyTree.Models
{
    public class Link
    {
        public Link(string source, string target)
        {
            Source = source;
            Target = target;
            Id = $"l{source}{target}";
        }
        //do serializacji
        public Link()
        {

        }
        
        public string Id { get; set; }
        public string Source { get; set; }
        public string Target { get; set; }
    }
}
