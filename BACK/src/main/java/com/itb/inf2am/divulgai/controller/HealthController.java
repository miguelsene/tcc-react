@RestController
@RequestMapping ("/api")
public class HealthController{
    @GetMapping ("/ping")
    public String ping () {
        return "ok";
    }
}